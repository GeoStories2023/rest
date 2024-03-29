import { Response, Router } from 'express';
import { getPrismaInstance, user } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { Prisma, User, Friend } from '@prisma/client';

export const router: Router = Router();

router.get('/:uid?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;

  prisma.user.findUnique({
    where: {
      uid: uid
    },
    include: {
      favoriteTours: {
        include: {
          tour: {
            include: {
              city: {
                include: {
                  country: {
                    include: {
                      continent: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      startedTours: {
        include: {
          tour: {
            include: {
              city: {
                include: {
                  country: {
                    include: {
                      continent: true
                    }
                  }
                }
              }
            }

          }
        }
      },
      coupons: true,
      friends: {
        include: {
          friendUser: true
        }
      }
    }
  }).then((user) => {
    res.json(user);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});

router.get('/statistics/:uid?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;

  // Get count of tours, Count of visted cities, countries and continents
  prisma.startedTour.count({
    where: {
      userId: uid
    }
  }).then((toursCount) => {


    prisma.startedTour.findMany({
      where: {
        userId: uid
      },
      include: {
        tour: {
          include: {
            city: {
              include: {
                country: {
                  include: {
                    continent: true
                  }
                }
              }
            }
          }
        }
      }
    }).then((startedTours) => {
      // Object out with countrries, cities and continents and count them
      // Example:
      // {
      //   toursCount: 10,
      //   visitedCities:{
      //     germany: 2,
      //     france: 1
      //  }


      const visitedCities = {};
      const visitedCountries = {};
      const visitedContinents = {};


      startedTours.forEach((startedTour) => {
        const city = startedTour.tour.city;
        const country = city?.country;
        const continent = country?.continent;

        if (city?.name) {
          if (visitedCities[city.name]) {
            visitedCities[city.name] += 1;
          } else {
            visitedCities[city.name] = 1;
          }
        }

        if (country?.name) {

          if (visitedCountries[country.name]) {
            visitedCountries[country.name] += 1;
          } else {
            visitedCountries[country.name] = 1;
          }
        }

        if (continent?.name) {
          if (visitedContinents[continent.name]) {
            visitedContinents[continent.name] += 1;
          } else {
            visitedContinents[continent.name] = 1;
          }
        }
      });

      const statistics = {
        toursCount: toursCount,
        visitedCities: visitedCities,
        visitedCountries: visitedCountries,
        visitedContinents: visitedContinents
      };

      res.json(statistics);

    }).catch((error) => {
      console.log(error);
      res.status(500).send('Internal server error');
    });
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.post('/friends', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.user?.uid;
  const friendName = req.body.friendName;

  if (req.user?.username === friendName) {
    res.status(400).send('Bad request');
    return;
  }

  // if (uid !== req.user?.uid) {
  //   res.status(403).send('Forbidden');
  //   return;
  // }

  prisma.user.findUnique({
    where: {
      uid: uid
    }
  }).then((user) => {
    if (user) {
      prisma.user.findUnique({
        where: {
          username: friendName
        }
      }).then((wantedFriend) => {
        if (wantedFriend) {
          prisma.friend.create({
            data: {
              user: {
                connect: {
                  uid: uid
                }
              },
              friendUser: {
                connect: {
                  username: friendName
                }
              }
            },
            include: {
              friendUser: true
            }
          }).then((friend) => {
            res.json(friend);
          }).catch((error) => {
            console.log(error);
            res.status(500).send('Internal server error');
          });
        } else {
          res.status(404).send('Not found');
        }
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Internal server error');
      });
    } else {
      res.status(404).send('Not found');
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.delete('/friends/:friendUid', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.user?.uid;
  const friendUid = req.params.friendUid;

  if (uid === friendUid) {
    res.status(400).send('Bad request');
    return;

  }

  // if (uid !== req.user?.uid) {
  //   res.status(403).send('Forbidden');
  //   return;
  // }

  prisma.friend.findFirst({
    where: {
      userId: uid,
      friendUserId: friendUid
    }
  }).then((friend) => {
    if (friend) {
      prisma.friend.delete({
        where: {
          id: friend.id
        }
      }).then((friend) => {
        res.json(friend);
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Internal server error');
      });
    } else {
      res.status(404).send('Not found');
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});


router.put("/setUsername/:uid?", (req: GeostoriesRequest, res: Response) => {
  const body = req.body;
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;

  // Temporary permission solution
  if (uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  }

  prisma.user.update({
    where: {
      uid: req.user?.uid
    },
    include: {
      favoriteTours: true,
      startedTours: true,
      coupons: true
    },
    data: {
      username: body.username,
      askUsername: false
    }
  }).then((user: User) => {
    res.json(user);
  }).catch((error: any) => {
    console.log(error);
    if (error.code === 'P2002') {
      res.status(400).send('Username already taken');
    } else {
      res.status(500).send('Internal server error');
    }
  });
});

router.delete('/:uid?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;

  // Temporary permission solution
  if (uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  }

  prisma.user.delete({
    where: {
      uid: uid
    }
  }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.put('/:uid?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;
  const user: Prisma.UserUncheckedUpdateInput = req.body.user;

  // Temporary permission solution
  if (uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  }

  prisma.user.update({
    where: {
      uid: uid
    },
    data: user
  }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

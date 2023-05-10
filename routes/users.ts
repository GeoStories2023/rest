import { Response, Router } from 'express';
import { getPrismaInstance, user } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { Prisma, User, Friend } from '@prisma/client';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  prisma.user.findUnique({
    where: {
      uid: req.user?.uid
    },
    include: {
      profileImage: true,
      favoriteTours: true,
      startedTours: true,
      coupons: true,
      friends: true
    }
  }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:uid', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  // TODO proper check for privacy settings
  if (req.user?.uid !== req.params.uid) {
    res.status(403).send('Forbidden');
    return;
  } else {
    prisma.user.findUnique({
      where: {
        uid: req.params.uid
      },
      include: {
        profileImage: true,
        favoriteTours: true,
        startedTours: true,
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
  }
});

router.post('/:uid/friends', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid;
  const friendUid = req.body.uid;

  if (uid === friendUid) {
    res.status(400).send('Bad request');
    return;
  }

  if (uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  }

  prisma.user.findUnique({
    where: {
      uid: uid
    }
  }).then((user) => {
    if (user) {
      prisma.user.findUnique({
        where: {
          uid: friendUid
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
                  uid: friendUid
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

router.delete('/:uid/friends/:friendUid', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid;
  const friendUid = req.params.friendUid;

  if (uid === friendUid) {
    res.status(400).send('Bad request');
    return;

  }

  if (uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  }

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


router.put("/setUsername", (req: GeostoriesRequest, res: Response) => {
  const body = req.body;
  const prisma = getPrismaInstance();

  prisma.user.update({
    where: {
      uid: req.user?.uid
    },
    include: {
      profileImage: true,
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
    res.status(500).send('Internal server error');
  });
});

router.delete('/:uid', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid;

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


router.put('/:uid', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid;
  const user = req.body;

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

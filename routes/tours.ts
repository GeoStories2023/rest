import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/started/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();


  console.log(req.user?.uid)

  prisma.startedTour.findMany({
    where: {
      userId: req.user?.uid
    },
    include: {
      visitedTourPoints: {
        include: {
          tourPoint: true
        }
      },
      tour: {
        include: {
          tourPoints: true
        }
      }
    }
  }).then((startedTours) => {
    res.json(startedTours);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/started/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.startedTour.findUnique({
    where: {
      id: id
    },
    include: {
      visitedTourPoints: {
        include: {
          tourPoint: true
        }
      },
      tour: {
        include: {
          tourPoints: true
        }
      }
    }
  }).then((startedTour) => {

    if (startedTour?.userId !== req.user?.uid) {
      res.status(403).send('Forbidden');
      return;
    }
    res.json(startedTour);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.delete('/started/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.startedTour.findUnique({
    where: {
      id: id
    },
    include: {
      visitedTourPoints: {
        include: {
          tourPoint: true
        }
      },
      tour: {
        include: {
          tourPoints: true
        }
      }
    }
  }).then((startedTour) => {

    if (startedTour?.userId !== req.user?.uid) {
      res.status(403).send('Forbidden');
      return;
    }

    prisma.startedTour.delete({
      where: {
        id: id
      }
    }).then((deletedStartedTour) => {
      res.json(deletedStartedTour);
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Internal server error');
    });
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.post('/start/', async (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const tourId = req.body.tourId;

  const newStartedTour: Prisma.StartedTourCreateInput = {
    tour: {
      connect: {
        id: tourId
      }
    },
    user: {
      connect: {
        uid: req.user?.uid
      }
    }
  }

  prisma.startedTour.create({
    data: newStartedTour,
    include: {
      tour: {
        include: {
          tourPoints: true
        }
      }
    }
  }).then((startedTour) => {
    res.json(startedTour);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.put('/stop/', async (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const startedTourId = req.body.startedTourId;

  const startedTour = await prisma.startedTour.findUnique({
    where: {
      id: startedTourId
    },
    include: {
      user: true
    }
  });

  if (startedTour?.user.uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  } else {
    prisma.startedTour.update({
      where: {
        id: startedTourId,
      },
      include: {
        user: true,
      },
      data: {
        isCompleted: true,
        dateEnded: new Date()
      }
    }).then((startedTour) => {
      res.json(startedTour);
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Internal server error');
    });
  }
});

router.post('/point/visited/', async (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const startedTourId = req.body.startedTourId;
  const tourPointId = req.body.tourPointId;

  const startedTour = await prisma.startedTour.findUnique({
    where: {
      id: startedTourId
    },
    include: {
      user: true
    }
  });

  if (startedTour?.user.uid !== req.user?.uid) {
    res.status(403).send('Forbidden');
    return;
  } else {
    prisma.tourPointOnStartedTour.create({
      data: {
        tourPoint: {
          connect: {
            id: tourPointId
          }
        },
        startedTour: {
          connect: {
            id: startedTourId
          }
        }
      }
    }).then((tourPointOnStartedTour) => {
      prisma.startedTour.findUnique({
        where: {
          id: startedTourId
        },
        include: {
          tour: {
            include: {
              tourPoints: true
            }
          },
          visitedTourPoints: {
            include: {
              tourPoint: true
            }
          }
        }
      }).then((startedTour) => {
        let isCompleted = true;
        for (const tourPoint of startedTour?.tour?.tourPoints ?? []) {
          if (!startedTour?.visitedTourPoints.find((tourPointOnStartedTour) => tourPointOnStartedTour.tourPoint.id === tourPoint.id)) {
            isCompleted = false;
            break;
          }
        }

        if (isCompleted) {
          prisma.startedTour.update({
            where: {
              id: startedTourId,
            },
            include: {
              user: true,
              tour: true,
              visitedTourPoints: {
                include: {
                  tourPoint: true
                }
              }
            },
            data: {
              isCompleted: true,
              dateEnded: new Date()
            }
          }).then((startedTour) => {
            res.json(startedTour);
          }).catch((error) => {
            console.log(error);
            res.status(500).send('Internal server error');
          });
        }

      }).catch((error) => {
        console.log(error)
        res.status(500).send('Internal server error');
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Internal server error');

    });
  }
});

router.get('/path/name/:continentName/:countryName?/:cityName?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const continentName: string = req.params.continentName;
  const countryName: string | undefined = req.params.countryName;
  const cityName: string | undefined = req.params.cityName;

  prisma.tour.findMany({
    where: {
      city: {
        name: {
          equals: cityName,
          mode: 'insensitive'
        },
        country: {
          name: {
            equals: countryName,
            mode: 'insensitive'
          },
          continent: {
            name: {
              equals: continentName,
              mode: 'insensitive'
            }
          }
        }
      }
    },
    include: {
      tourPoints: true,
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
  }).then((tours) => {
    res.json(tours);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/path/id/:continentId/:countryId?/:cityId?', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const continentId: string = req.params.continentId;
  const countryId: string | undefined = req.params.countryId;
  const cityId: string | undefined = req.params.cityId;

  prisma.tour.findMany({
    where: {
      city: {
        id: cityId,
        country: {
          id: countryId,
          continent: {
            id: continentId
          }
        }
      }
    },
    include: {
      tourPoints: true,
      city: true
    }
  }).then((tours) => {
    res.json(tours);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


// Create tour object
router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const tour = req.body;

  prisma.tour.create({
    data: tour
  }).then((tour) => {
    res.json(tour);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

// update tour object

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const tour = req.body;

  prisma.tour.update({
    where: {
      id: req.params.id
    },
    data: tour
  }).then((tour) => {
    res.json(tour);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

// create tour point object
router.post('/point/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const tourPoint = req.body;

  prisma.tourPoint.create({
    data: tourPoint
  }).then((tourPoint) => {
    res.json(tourPoint);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
}
);

// update tour point object
router.put('/point/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const tourPoint = req.body;

  prisma.tourPoint.update({
    where: {
      id: req.params.id
    },
    data: tourPoint
  }).then((tourPoint) => {
    res.json(tourPoint);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.tour.findMany({
    include: {
      tourPoints: true,
      city: true

    }
  }).then((tours) => {
    res.json(tours);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.tour.findUnique({
    where: {
      id: id
    },
    include: {
      tourPoints: true,
      city: true
    }

  }).then((tour) => {
    res.json(tour);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
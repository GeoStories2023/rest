
import { Request, Response, Router } from 'express';
import { Prisma, User } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { authMiddleware } from '../middleware';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.tour.findMany({
    include: {
      image: true
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
      image: true
    }

  }).then((tour) => {
    res.json(tour);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/started/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.startedTour.findMany({
    where: {
      userId: req.user?.uid
    },
    include: {
      tour: true
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
      tour: true
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
    data: newStartedTour
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
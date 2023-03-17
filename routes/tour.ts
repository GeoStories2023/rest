
import { Request, Response, Router } from 'express';
import { Prisma, User } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/request';
import { authMiddleware } from '../middleware';

export const router: Router = Router();


router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.tour.findUnique({
    where: {
      id: id
    }
  }).then((tour) => {
    res.json(tour);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.tour.findMany().then((tours) => {
    res.json(tours);
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
  // TODO update where id == startedTourId and user uid is the same as the user who is logged in

  prisma.startedTour.update({
    where: {
      id: startedTourId,
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
});
import { Response, Router } from 'express';
import { getPrismaInstance, user } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { Prisma, User, Friend } from '@prisma/client';

export const router: Router = Router();

router.get('/:tourId', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;
  const tourId = req.params.tourId;

  prisma.diary.findFirst({
    where: {
      user: {
        uid: uid
      },
      tour: {
        id: tourId
      }
    },
    include: {
      tour: true
    }

  }).then((diary) => {
    res.json(diary);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;

  prisma.diary.findMany({
    where: {
      user: {
        uid: uid
      }
    },
    include: {
      tour: true
    }
  }).then((diaries) => {
    res.json(diaries);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});

router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;
  const diary = req.body as Prisma.DiaryCreateInput;

  diary.user = {
    connect: {
      uid: uid
    }
  };

  prisma.diary.create({
    data: diary
  }).then((diary) => {
    res.json(diary);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

}
);

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;
  const diary = req.body as Prisma.DiaryUpdateInput;
  const id = req.params.id;

  prisma.diary.update({
    where: {
      id: id
    },
    data: diary
  }).then((diary) => {
    res.json(diary);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});

router.delete('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const uid = req.params.uid ?? req.user?.uid;
  const id = req.params.id;

  prisma.diary.delete({
    where: {
      id: id
    }
  }).then((diary) => {
    res.json(diary);
  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });

});
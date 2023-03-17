import { Request, Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/request';
import { authMiddleware } from '../middleware';

export const router: Router = Router();

router.get('/:uid', authMiddleware, (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.user.findUnique({
    where: {
      uid: req.uid
    }
  }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.put("/setUsername", authMiddleware, (req: GeostoriesRequest, res: Response) => {
  const body = req.body;
  const prisma = getPrismaInstance();

  prisma.user.update({
    where: {
      uid: req.uid
    },
    data: {
      username: body.username,
      askUsername: false
    }
  }).then((user) => {
    res.json(user);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


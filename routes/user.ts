import { Request, Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/request';
import { authMiddleware } from '../middleware';

export const router: Router = Router();

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
      }
    }).then((user) => {
      res.json(user);
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Internal server error');
    });
  }
});


router.put("/setUsername", (req: GeostoriesRequest, res: Response) => {
  const body = req.body;
  const prisma = getPrismaInstance();

  prisma.user.update({
    where: {
      uid: req.user?.uid
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

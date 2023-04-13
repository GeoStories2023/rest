import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.tourPointType.findUnique({
    where: {
      id: id
    }
  }).then((tourPointType) => {
    res.json(tourPointType);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
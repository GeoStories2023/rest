import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.image.findMany({

  }).then((images) => {
    res.json(images);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
}
);

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.image.findUnique({
    where: {
      id: id
    },
  }).then((image) => {
    res.json(image);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const image: Prisma.ImageCreateInput = req.body;

  prisma.image.update({
    where: {
      id: image.id
    },
    data: image
  }).then((image) => {
    res.json(image);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.delete('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.image.delete({
    where: {
      id: id
    },
  }).then((image) => {
    res.json(image);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
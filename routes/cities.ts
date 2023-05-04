
import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.city.findMany({
    include: {
      country: true,
      image: true
    }
  }).then((cities) => {
    res.json(cities);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.city.findUnique({
    where: {
      id: id
    },
    include: {
      country: true,
      image: true
    }
  }).then((city) => {
    res.json(city);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.get('/name/:name', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const name = req.params.name;

  prisma.city.findFirst({
    where: {
      name: name
    },
    include: {
      country: true,
      image: true
    }
  }).then((city) => {
    res.json(city);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

// create city
router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const city: Prisma.CityCreateInput = req.body;

  prisma.city.create({
    data: city
  }).then((city) => {
    res.json(city);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const city: Prisma.CityCreateInput = req.body;

  prisma.city.update({
    where: {
      id: req.params.id
    },
    data: city
  }).then((city) => {
    res.json(city);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
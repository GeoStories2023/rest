
import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const includeCities: boolean = req.query.includeCities === 'true';


  prisma.country.findMany({
    include: {
      continent: true,
      cities: includeCities,
      image: true
    }
  }).then((countries) => {
    res.json(countries);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;
  const includeCities: boolean = req.query.includeCities === 'true';


  prisma.country.findUnique({
    where: {
      id: id
    },
    include: {
      continent: true,
      cities: includeCities,
      image: true
    }
  }).then((country) => {
    res.json(country);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.get('/name/:name', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const name = req.params.name;
  const includeCities: boolean = req.query.includeCities === 'true';


  prisma.country.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    },
    include: {
      continent: true,
      cities: includeCities,
      image: true
    }
  }).then((country) => {
    res.json(country);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

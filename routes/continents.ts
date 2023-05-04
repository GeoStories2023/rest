
import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  const includeCountries: boolean = req.query.includeCountries === 'true';

  prisma.continent.findMany({
    include: {
      countries: includeCountries,
      image: true
    }
  }).then((continents) => {
    res.json(continents);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;
  const includeCountries: boolean = req.query.includeCountries === 'true';

  prisma.continent.findUnique({
    where: {
      id: id
    },
    include: {
      countries: includeCountries,
      image: true
    }
  }).then((continent) => {
    res.json(continent);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});


router.get('/name/:name', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const name = req.params.name;
  const includeCountries: boolean = req.query.includeCountries === 'true';

  prisma.continent.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    },
    include: {
      countries: includeCountries,
      image: true
    }
  }).then((continent) => {
    res.json(continent);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const continent: Prisma.ContinentCreateInput = req.body;

  prisma.continent.create({
    data: continent
  }).then((continent) => {
    res.json(continent);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

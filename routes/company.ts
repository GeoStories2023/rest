
import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.company.findMany({
    include: {
      coupons: true
    }
  }).then((companies) => {
    res.json(companies);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
}
);

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.company.findUnique({
    where: {
      id: id
    },
    include: {
      coupons: true
    }
  }).then((company) => {
    res.json(company);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const company: Prisma.CompanyCreateInput = req.body;

  prisma.company.create({
    data: company
  }).then((company) => {
    res.json(company);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
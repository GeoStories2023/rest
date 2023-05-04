import { Response, Router } from 'express';
import { Prisma } from '@prisma/client';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.coupon.findMany({
    include: {

    }
  }).then((coupons) => {
    res.json(coupons);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.coupon.findUnique({
    where: {
      id: id
    },
    include: {

    }

  }).then((coupon) => {
    res.json(coupon);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.post('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const coupon: Prisma.CouponCreateInput = req.body;

  prisma.coupon.create({
    data: coupon
  }).then((coupon) => {
    res.json(coupon);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const coupon: Prisma.CouponCreateInput = req.body;

  prisma.coupon.update({
    where: {
      id: req.params.id
    },
    data: coupon
  }).then((coupon) => {
    res.json(coupon);
  }
  ).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.delete('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.coupon.delete({
    where: {
      id: id
    }
  }).then((coupon) => {
    res.json(coupon);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

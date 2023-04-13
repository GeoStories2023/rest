import { Response, Router } from 'express';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  prisma.level.findMany({}).then((levels) => {
    res.json(levels);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.level.findUnique({
    where: {
      id: id
    }
  }).then((level) => {
    res.json(level);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/byXp/:xp', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const xp = +req.params.xp;

  prisma.level.findFirst({
    where: {
      xp: {
        gte: xp
      }
    }
  }).then((level) => {
    res.json(level);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});
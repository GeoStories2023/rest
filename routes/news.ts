import { Response, Router } from 'express';
import { getPrismaInstance } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';

export const router: Router = Router();

router.get('/', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  prisma.news.findMany({

  }).then((news) => {
    res.json(news);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.get('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.news.findUnique({
    where: {
      id: id
    },

  }).then((news) => {
    res.json(news);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.put('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const news = req.body;
  prisma.news.update({
    where: {
      id: news.id
    },
    data: news
  }).then((news) => {
    res.json(news);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

router.delete('/:id', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  prisma.news.delete({
    where: {
      id: id
    }
  }).then((news) => {
    res.json(news);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Internal server error');
  });
});

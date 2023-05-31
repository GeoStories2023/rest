import { Response, Router } from 'express';
import { getPrismaInstance, user } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { Prisma, User, Friend, Country } from '@prisma/client';

export const router: Router = Router();

router.get('/init', async (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  // Delete all continents
  await prisma.continent.deleteMany().then(async () => {
    console.log('All continents deleted');
    // Delete all countries
    await prisma.country.deleteMany().then(async () => {
      console.log('All countries deleted')
      // Delete all cities
      await prisma.city.deleteMany().then(() => {
        console.log('All cities deleted');
      });
    });
  });

  // create all continents
  await prisma.continent.createMany({
    data: [
      { name: 'Africa' },
      { name: 'Antarctica' },
      { name: 'Asia' },
      { name: 'Australia' },
      { name: 'Europe' },
      { name: 'North America' },
      { name: 'South America' },
    ],
    skipDuplicates: false,
  }).then(async () => {
    //* Get continent europe
    await prisma.continent.findFirst({
      where: {
        name: 'Europe'
      }
    }).then(async (continent) => {
      if (continent) {
        await prisma.country.createMany({
          data: [
            { name: 'Germany', continentId: continent.id },
            { name: 'France', continentId: continent.id },
            { name: 'United Kingdom', continentId: continent.id },
          ]
        }).then(async () => {
          // Get country germany
          await prisma.country.findFirst({
            where: {
              name: 'Germany'
            }
          }).then(async (country) => {
            if (country) {
              await prisma.city.createMany({
                data: [
                  { name: 'Berlin', countryId: country.id },
                  { name: 'Hamburg', countryId: country.id },
                  { name: 'Munich', countryId: country.id },
                ]
              }).then(() => {
                console.log('Cities for germany created');
              }).catch((error: any) => console.log(error));
            }
          }).catch((error: any) => console.log(error));

          // Get country france
          await prisma.country.findFirst({
            where: {
              name: 'France'
            }
          }).then(async (country) => {
            if (country) {
              await prisma.city.createMany({
                data: [
                  { name: 'Paris', countryId: country.id },
                  { name: 'Lyon', countryId: country.id },
                  { name: 'Marseille', countryId: country.id },
                ]
              }).then(() => {
                console.log('Cities for france created');
              }).catch((error: any) => console.log(error));
            }
          }).catch((error: any) => console.log(error));

          // Get country united kingdom
          await prisma.country.findFirst({
            where: {
              name: 'United Kingdom'
            }
          }).then(async (country) => {
            if (country) {
              await prisma.city.createMany({
                data: [
                  { name: 'London', countryId: country.id },
                  { name: 'Birmingham', countryId: country.id },
                  { name: 'Manchester', countryId: country.id },
                ]
              }).then(() => {
                console.log('Cities for united kingdom created');
              }).catch((error: any) => console.log(error));
            }
          }).catch((error: any) => console.log(error));
        }).catch((error: any) => console.log(error));
      }
    }).catch((error: any) => console.log(error));


    //* Get continent north america
    await prisma.continent.findFirst({
      where: {
        name: 'North America'
      }
    }).then(async (continent) => {
      if (continent) {
        // Create USA
        await prisma.country.createMany({
          data: [
            { name: 'United States of America', continentId: continent.id },
          ]
        }).then(async () => {
          // Get country united states of america
          await prisma.country.findFirst({
            where: {
              name: 'United States of America'
            }
          }).then(async (country) => {
            if (country) {
              // Create cities for united states of america
              await prisma.city.createMany({
                data: [{ name: "New York", countryId: country.id }, { name: "Los Angeles", countryId: country.id }, { name: "Chicago", countryId: country.id }]
              }).then(() => {
                console.log('Cities for united states of america created');
              }
              ).catch((error: any) => console.log(error));
            }
          }
          ).catch((error: any) => console.log(error));
        }).catch((error: any) => console.log(error));
      }
    }).catch((error: any) => console.log(error));
  });

  res.json({ message: 'Init done' });
});

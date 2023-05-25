import { Response, Router } from 'express';
import { getPrismaInstance, user } from '../lib/prisma';
import { GeostoriesRequest } from '../interfaces/iRequest';
import { Prisma, User, Friend, Country } from '@prisma/client';

export const router: Router = Router();

router.get('/init', (req: GeostoriesRequest, res: Response) => {
  const prisma = getPrismaInstance();

  // Delete all continents
  prisma.continent.deleteMany().then(() => {
    // Delete all countries
    prisma.country.deleteMany().then(() => {
      // Delete all cities
      prisma.city.deleteMany().then(() => {



      });
    });
  });

  // create all continents
  prisma.continent.createMany({
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
  }).then((continents) => {
    // create all countries
    prisma.country.createMany({
      data: [
        { name: 'Afghanistan', continentId: continents[2].id },
        { name: 'Albania', continentId: continents[4].id },
        { name: 'Algeria', continentId: continents[0].id },
        { name: 'American Samoa', continentId: continents[3].id },
        { name: 'Andorra', continentId: continents[4].id },
        { name: 'Angola', continentId: continents[0].id },
        { name: 'Anguilla', continentId: continents[5].id },
        { name: 'Antarctica', continentId: continents[1].id },
        { name: 'Antigua and Barbuda', continentId: continents[5].id },
        { name: 'Argentina', continentId: continents[6].id },
        { name: 'Armenia', continentId: continents[2].id },
        { name: 'Aruba', continentId: continents[5].id },
        { name: 'Australia', continentId: continents[3].id },
        { name: 'Austria', continentId: continents[4].id },
        { name: 'Azerbaijan', continentId: continents[2].id },
        { name: 'Bahamas', continentId: continents[5].id },
        { name: 'Bahrain', continentId: continents[2].id },
        { name: 'Bangladesh', continentId: continents[2].id },
        { name: 'Barbados', continentId: continents[5].id },
        { name: 'Belarus', continentId: continents[4].id },
        { name: 'Belgium', continentId: continents[4].id },
        { name: 'Belize', continentId: continents[5].id },
        { name: 'Benin', continentId: continents[0].id },
        { name: 'Bermuda', continentId: continents[5].id },
        { name: 'Bhutan', continentId: continents[2].id },
        { name: 'Bolivia', continentId: continents[6].id },
        { name: 'Bosnia and Herzegovina', continentId: continents[4].id },
        { name: 'Botswana', continentId: continents[0].id },
        { name: 'Bouvet Island', continentId: continents[1].id },
        { name: 'Brazil', continentId: continents[6].id },
        { name: 'British Indian Ocean Territory', continentId: continents[5].id },
        { name: 'Brunei Darussalam', continentId: continents[2].id },
        { name: 'Bulgaria', continentId: continents[4].id },
        { name: 'Burkina Faso', continentId: continents[0].id },
        { name: 'Burundi', continentId: continents[0].id },
        { name: 'Cambodia', continentId: continents[2].id },
        { name: 'Cameroon', continentId: continents[0].id },
        { name: 'Canada', continentId: continents[5].id },
        { name: 'Cape Verde', continentId: continents[0].id },
        { name: 'Cayman Islands', continentId: continents[5].id },
        { name: 'Central African Republic', continentId: continents[0].id },
        { name: 'Chad', continentId: continents[0].id },
        { name: 'Chile', continentId: continents[6].id },
        { name: 'China', continentId: continents[2].id },
        { name: 'Christmas Island', continentId: continents[3].id },
        { name: 'Cocos (Keeling) Islands', continentId: continents[3].id },
        { name: 'Colombia', continentId: continents[6].id },
        { name: 'Comoros', continentId: continents[0].id },
        { name: 'Congo', continentId: continents[0].id },
        { name: 'Congo, The Democratic Republic of the', continentId: continents[0].id },
        { name: 'Cook Islands', continentId: continents[3].id },
        { name: 'Costa Rica', continentId: continents[5].id },
        { name: 'Cote D\'Ivoire', continentId: continents[0].id },
        { name: 'Croatia', continentId: continents[4].id },
        { name: 'Cuba', continentId: continents[5].id },
        { name: 'Cyprus', continentId: continents[4].id },
        { name: 'Czech Republic', continentId: continents[4].id },
        { name: 'Denmark', continentId: continents[4].id },
        { name: 'Djibouti', continentId: continents[0].id },
        { name: 'Dominica', continentId: continents[5].id },
        { name: 'Dominican Republic', continentId: continents[5].id },
        { name: 'Ecuador', continentId: continents[6].id },
        { name: 'Egypt', continentId: continents[0].id },
        { name: 'El Salvador', continentId: continents[5].id },
        { name: 'Equatorial Guinea', continentId: continents[0].id },
        { name: 'Eritrea', continentId: continents[0].id },
        { name: 'Estonia', continentId: continents[4].id },
        { name: 'Ethiopia', continentId: continents[0].id },
        { name: 'Falkland Islands (Malvinas)', continentId: continents[6].id },
        { name: 'Faroe Islands', continentId: continents[4].id },
        { name: 'Fiji', continentId: continents[3].id },
        { name: 'Finland', continentId: continents[4].id },
        { name: 'France', continentId: continents[4].id },
        { name: 'French Guiana', continentId: continents[6].id },
        { name: 'French Polynesia', continentId: continents[3].id },
        { name: 'French Southern Territories', continentId: continents[1].id },
        { name: 'Gabon', continentId: continents[0].id },
        { name: 'Gambia', continentId: continents[0].id },
        { name: 'Georgia', continentId: continents[2].id },
        { name: 'Germany', continentId: continents[4].id },
        { name: 'Ghana', continentId: continents[0].id },
        { name: 'Gibraltar', continentId: continents[4].id },
        { name: 'Greece', continentId: continents[4].id },
        { name: 'Greenland', continentId: continents[4].id },
        { name: 'Grenada', continentId: continents[5].id },
        { name: 'Guadeloupe', continentId: continents[5].id },
        { name: 'Guam', continentId: continents[3].id },
        { name: 'Guatemala', continentId: continents[5].id },
        { name: 'Guernsey', continentId: continents[4].id },
        { name: 'Guinea', continentId: continents[0].id },
        { name: 'Guinea-Bissau', continentId: continents[0].id },
        { name: 'Guyana', continentId: continents[6].id },
        { name: 'Haiti', continentId: continents[5].id },
        { name: 'Heard Island and Mcdonald Islands', continentId: continents[3].id },
        { name: 'Holy See (Vatican City State)', continentId: continents[4].id },
        { name: 'Honduras', continentId: continents[5].id },
        { name: 'Hong Kong', continentId: continents[2].id },
        { name: 'Hungary', continentId: continents[4].id },
        { name: 'Iceland', continentId: continents[4].id },
        { name: 'India', continentId: continents[2].id },
        { name: 'Indonesia', continentId: continents[2].id },
        { name: 'Iran, Islamic Republic Of', continentId: continents[2].id },
        { name: 'Iraq', continentId: continents[2].id },
        { name: 'Ireland', continentId: continents[4].id },
        { name: 'United Kingdom', continentId: continents[4].id },
      ]
    }).then((countries) => {
      console.log('Countries created');
      prisma.city.createMany({
        data: [
          { name: 'Berlin', countryId: countries[74].id },
          { name: 'Hamburg', countryId: countries[74].id },
          { name: 'Munich', countryId: countries[74].id },
          { name: 'Paris', countryId: countries[75].id },
          { name: 'Marseille', countryId: countries[75].id },
          { name: 'Lyon', countryId: countries[75].id },
          { name: 'London', countryId: countries[103].id },
          { name: 'Birmingham', countryId: countries[103].id },
          { name: 'Liverpool', countryId: countries[103].id },
          { name: 'Manchester', countryId: countries[103].id },
          { name: 'New York', countryId: countries[77].id },
          { name: 'Los Angeles', countryId: countries[77].id },
          { name: 'Chicago', countryId: countries[77].id },
          { name: 'Houston', countryId: countries[77].id },
          { name: 'Phoenix', countryId: countries[77].id },
        ]
      }).then((cities) => {
        console.log('Cities created');
        res.send('Cities created');
      }).catch((error: any) => console.log(error));

    }).catch((error: any) => console.log(error));



  }).catch((error: any) => {
    console.log(error);
    res.status(500).send('Internal server error');
  }
  );



});

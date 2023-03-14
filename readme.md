# REST-API

- [REST-API](#rest-api)
  - [Installation](#installation)

## Installation

1. Clone the repository.
2. Go to <https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk> and download the private key.
3. Rename the private key to `firebaseServiceAccountKey.json` and place it in the root directory of the project.
4. Create a `.env` file in the root directory of the project and add the following content (for development):

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/geostories"
   ```

5. Run the docker compose file of the project.
6. Run `npm run dev`

import admin from 'firebase-admin';

import serviceAccount from '../firebaseServiceAccountKey.json';

let firebaseAdmin: admin.app.App;

export default function getFirebaseAdmin() {
  if (!firebaseAdmin) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  return firebaseAdmin;
}

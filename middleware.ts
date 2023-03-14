import { NextFunction, Request, Response } from "express";
import getFirebaseAdmin from "./lib/firebase";


export function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authHeader: string | undefined = req.headers?.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    getFirebaseAdmin().auth().verifyIdToken(token).then((decodedToken) => {
      if (decodedToken.email_verified) {
        console.log('decodedToken', decodedToken);

        next();
      } else {
        res.status(401).send('Email not verified');
      }
    }).catch((error) => {
      console.log(error)
      res.status(401).send('Unauthorized');
    });
  } else {
    res.status(401).send('No auth key provided');
  }
}
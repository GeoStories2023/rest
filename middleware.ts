import { NextFunction, Request, Response } from "express";
import getFirebaseAdmin from "./lib/firebase";
import { getPrismaInstance } from './lib/prisma';
import { Prisma, User } from '@prisma/client';
import { GeostoriesRequest } from "interfaces/iRequest";

const DEBUG_NO_EMAIL_VERIFICATION = true;

async function createGeostoriesUser(id: string): Promise<User> {
  const prisma = getPrismaInstance();
  console.log('Creating new user: ' + id)

  const newUser: Prisma.UserCreateInput = {
    uid: id,
  }

  return await prisma.user.create({
    data: newUser
  })
}

export function authMiddleware(req: GeostoriesRequest, res: Response, next: NextFunction) {
  const authHeader: string | undefined = req.headers?.authorization;
  const prisma = getPrismaInstance();

  console.log("authMiddleware")

  if (authHeader) {
    console.log("authHeader")
    const token = authHeader.split(' ')[1];

    getFirebaseAdmin().auth().verifyIdToken(token).then(async (decodedToken) => {
      console.log("decodedToken")
      if (decodedToken.email_verified || DEBUG_NO_EMAIL_VERIFICATION) {
        console.log("decodedToken.email_verified")

        const user = await prisma.user.findUnique({ where: { uid: decodedToken.uid } });
        if (user) {
          console.log("user")
          console.log(req.user)
          req.user = user;
        } else {
          req.user = await createGeostoriesUser(decodedToken.uid);
        }
        if (req.user) {
          console.log("next")
          next();
        } else {
          res.status(401).send('Unauthorized');
        }
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
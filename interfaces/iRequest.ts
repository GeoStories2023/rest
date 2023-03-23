import { Prisma, User } from '@prisma/client';
import { Request } from 'express';

export interface GeostoriesRequest extends Request {
  user?: User;
}
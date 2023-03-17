import { Request } from 'express';

export interface GeostoriesRequest extends Request {
  uid?: string;
}
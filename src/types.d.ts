import { Request } from 'express';
import { SessionPayload } from './auth/entities/auth.entity';

type CustomRequest = Request & {
  session: SessionPayload;
};

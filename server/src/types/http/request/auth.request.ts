import { Request } from 'express';
import { JwtPayload } from '../../jwt-payload';

export interface IAuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

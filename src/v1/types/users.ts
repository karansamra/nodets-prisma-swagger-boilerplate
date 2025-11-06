import { ICommonResourceProperties } from './common';

export interface IUser extends ICommonResourceProperties {
  username: string;
  email: string;
  password: string;
  verified: boolean;
}

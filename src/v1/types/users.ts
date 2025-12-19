import { ICommonResourceProperties } from './common';

export interface IUser extends ICommonResourceProperties {
  userName: string;
  email: string;
  password: string;
  verified: boolean;
}

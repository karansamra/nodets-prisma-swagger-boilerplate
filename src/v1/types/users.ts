import { ICommonResourceProperties } from '@src/v1/types/common';

export interface IUser extends ICommonResourceProperties {
  username: string;
  email: string;
  password: string;
  verified: boolean;
}

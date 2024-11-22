import { Exclude, Expose } from 'class-transformer';
import { CommonDTO } from './commonDto';

export class UserDTO extends CommonDTO {
  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  userName!: string;

  @Expose()
  email!: string;

  @Expose()
  age!: number;

  @Expose()
  verified!: boolean;

  @Expose()
  password!: string;

  @Exclude()
  confirmPassword!: string;
}

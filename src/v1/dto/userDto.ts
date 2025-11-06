import { Exclude, Expose } from 'class-transformer';
import { CommonDTO } from '@src/v1/dto/commonDto';

export class UserDTO extends CommonDTO {
  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  age!: number;

  @Expose()
  verified!: boolean;

  @Exclude()
  password!: string;
}

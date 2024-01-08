import { Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  email!: string;

  @Expose()
  age!: number;

  @Exclude()
  password!: string;
}

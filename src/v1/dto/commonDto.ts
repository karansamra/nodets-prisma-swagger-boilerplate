import { Expose } from 'class-transformer';

export class CommonDTO {
  @Expose()
  id!: number;

  @Expose()
  uuid!: string;

  @Expose()
  status!: number;

  @Expose()
  isDeleted!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export type TKeysWithUnknown = {
  [key: string]: unknown;
};
export type TKeysWithString = {
  [key: string]: string;
};
export type TKeysWithNumber = {
  [key: string]: number;
};
export type TKeysWithBoolean = {
  [key: string]: boolean;
};
export type TKeysWithDate = {
  [key: string]: Date | null;
};
export interface IReturnType {
  success: boolean;
  data: { resType?: number; resData: any };
  error?: unknown;
  [key: string]: unknown;
}

export interface ICommonResourceProperties {
  uuid?: string;
  id: number;
  isDeleted?: number;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

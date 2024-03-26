export interface IReturnType {
  success: boolean;
  data: { resType?: number; resData: any };
  error?: unknown;
  [key: string]: unknown;
}

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

const handleError = function handleError1(
  this: any,
  message: string,
  code: number,
  errorData: any = {}
) {
  this.code = code;
  this.message = message;
  this.errorData = errorData;
};

handleError.prototype = Error.prototype;

export { handleError };

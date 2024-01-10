import { Validator } from "node-input-validator";

const validate = async (data: any, fieldsToCheck: any) => {
  const v = new Validator(data, fieldsToCheck);

  const matched = await v.check();
  if (!matched) {
    return { status: false, data: v.errors };
  } else {
    return { status: true, data: {} };
  }
};
export { validate };

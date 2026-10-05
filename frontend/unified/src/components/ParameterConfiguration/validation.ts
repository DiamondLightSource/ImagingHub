import Ajv from "ajv";
import addFormats from "ajv-formats";
import { ptypyI08FromConfigSchema } from "./schemas/ptypy-I08-1-from-config";

export const ajv = new Ajv();
addFormats(ajv);
ajv.addSchema(ptypyI08FromConfigSchema, "ptypy-i08-1-from-config");

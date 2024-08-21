import { Logger } from '@nestjs/common';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, useDefaults: true });

const schema = {
  type: 'object',
  properties: {
    TYPEORM_HOST: { type: 'string' },
    TYPEORM_PORT: { type: 'string' },
    TYPEORM_USERNAME: { type: 'string' },
    TYPEORM_PASSWORD: { type: 'string' },
    TYPEORM_DATABASE: { type: 'string' },
  },
  required: [
    'TYPEORM_HOST',
    'TYPEORM_PORT',
    'TYPEORM_USERNAME',
    'TYPEORM_PASSWORD',
    'TYPEORM_DATABASE',
  ],
};

const validate = ajv.compile(schema);

export const validateSchemaEnv = (env: unknown) => {
  const valid = validate(env);
  if (!valid) {
    const errorMessages = validate.errors
      .map((err) => ` Property${err.instancePath} ${err.message}`)
      .join(', ');
    Logger.error(
      `Environment validation error:${errorMessages}`,
      'EnvValidation',
    );
  }
  return env;
};

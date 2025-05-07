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

interface EnvVariables {
  TYPEORM_HOST: string;
  TYPEORM_PORT: string;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
}

export const validateSchemaEnv = (env: unknown) => {
  const valid = validate(env);
  if (!valid) {
    const errorMessages = validate.errors
        ?.map(
          (err: { instancePath?: string; message?: string }) =>
            `- ${err.instancePath || ''} ${err.message || 'Unknown error'}`,
        )
       .join('\n') ?? 'Unknown error';
    console.error(`Environment validation error: \n${errorMessages}`);
  }
  return env as EnvVariables;
};

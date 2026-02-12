import { Type, type Static } from '@fastify/type-provider-typebox';

export const RegisterBodySchema = Type.Object(
  {
    email: Type.String({ format: 'email', description: 'User email address' }),
    password: Type.String({ minLength: 6, description: 'User password' }),
    firstName: Type.String({ minLength: 3, description: 'User first name' }),
    lastName: Type.String({ minLength: 3 }),
    roles: Type.Optional(
      Type.Array(Type.String({ enum: ['USER', 'ADMIN'] }), {
        description: 'User roles'
      })
    ),
    dateOfRegistration: Type.String({
      format: 'date',
      description: 'Date of user registration'
    }),
    dateOfLastAccess: Type.String({
      format: 'date',
      description: 'Date of last user access'
    })
  },
  {
    additionalProperties: false,
    description: 'Request body for user registration'
  }
);

export const ErrorResponse = Type.Object(
  {
    statusCode: Type.Number({ description: 'HTTP status code' }),
    error: Type.String({ description: 'Error type' }),
    message: Type.String({ description: 'Error message' })
  },
  {
    additionalProperties: true,
    description: 'Standard error response format'
  }
);

export const registerSchema = {
  tags: ['register'],
  summary: 'Register user',
  description: 'Register a new user',
  security: [],
  body: RegisterBodySchema,
  response: {
    201: Type.Object({
      id: Type.String({ description: 'User ID' }),
      email: Type.String({
        format: 'email',
        description: 'User email address'
      }),
      firstName: Type.String({ minLength: 3, description: 'User first name' }),
      lastName: Type.String({ minLength: 3, description: 'User last name' }),
      roles: Type.Array(Type.String(), { description: 'User roles' }),
      dateOfRegistration: Type.String({
        format: 'date',
        description: 'Date of user registration'
      }),
      dateOfLastAccess: Type.String({
        format: 'date',
        description: 'Date of last user access'
      })
    }),
    400: ErrorResponse,
    409: ErrorResponse,
    500: ErrorResponse
  }
};

export type RegisterBody = Static<typeof RegisterBodySchema>;
export type RegisterPayload = RegisterBody;

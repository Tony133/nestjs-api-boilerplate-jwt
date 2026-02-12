import { Type, type Static } from "@fastify/type-provider-typebox";
import { UserResponse } from "../users/users.schema";

export const LoginBodySchema = Type.Object(
  {
    email: Type.String({ format: "email", description: "User email address" }),
    password: Type.String({ minLength: 6, description: "User password" })
  },
  {
    additionalProperties: false,
    description: "Request body for user login"
  }
);

export const RefreshTokenPayloadSchema = Type.Object(
  {
    id: Type.String({ description: 'User ID' }),
    name: Type.String({ description: 'User name' }),
    email: Type.String({ description: 'User email' }),
    role: Type.String({ description: 'User role' })
  },
  {
    description: 'Payload contained in the refresh token'
  }
);

export const RefreshTokenRequestSchema = Type.Object(
  {
    refreshToken: Type.String({ description: "Refresh token issued during login" })
  },
  {
    additionalProperties: false,
    description: "Request body for refreshing access token"
  }
);

export const IsAuthenticationResponse = Type.Object(
  {
    authenticated: Type.Boolean({
      description: 'Indicates if the user is authenticated'
    })
  },
  {
    description: 'Response indicating authentication status'
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

export const loginSchema = {
  tags: ['authentication'],
  summary: 'User authentication',
  description: 'Authenticate user and return access token',
  security: [],
  body: LoginBodySchema,
  response: {
    400: ErrorResponse,
    401: ErrorResponse
  }
};

export const refreshTokenSchema = {
  tags: ["authentication"],
  summary: "Refresh access token",
  description: "Refresh access token using a valid refresh token",
  body: RefreshTokenRequestSchema,
  response: {
    400: ErrorResponse,
    401: ErrorResponse
  }
};

export const isAuthenticationSchema = {
  tags: ["authentication"],
  summary: "Check if user is authenticated",
  description: "Check if the provided token is valid and the user is authenticated",
  response: {
    200: IsAuthenticationResponse,
    400: ErrorResponse,
    401: ErrorResponse,
    500: ErrorResponse
  }
};

export const userAuthenticatedSchema = {
  tags: ["authentication"],
  summary: "Get authenticated user data",
  description: "Retrieve data of the authenticated user",
  response: {
    200: UserResponse,
    400: ErrorResponse,
    401: ErrorResponse
  }
};

export type LoginBody = Static<typeof LoginBodySchema>;
export type RefreshTokenBody = Static<typeof RefreshTokenRequestSchema>;
export type RefreshTokenPayload = Static<typeof RefreshTokenPayloadSchema>;
export type UserAuthenticatedReply = Static<typeof UserResponse>;

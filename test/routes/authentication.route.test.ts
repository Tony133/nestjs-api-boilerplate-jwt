import { test, describe, after, before } from 'node:test';
import assert from 'node:assert';
import { build } from '../helper';

describe('Authentication Routes', () => {
  let app: any;

  before(async (t: any) => {
    app = await build(t);

    await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        roles: ['USER'],
        dateOfRegistration: new Date().toISOString().split('T')[0],
        dateOfLastAccess: new Date().toISOString().split('T')[0]
      }
    });
  });

  after(async () => {
    if (app) await app.close();
  });

  test('should successfully login with valid credentials', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/authentication/login',
      payload: {
        email: 'test@example.com',
        password: 'password123'
      }
    });

    const payload = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 200);
    assert.ok(payload.accessToken, 'Should return a JWT access token');
    assert.strictEqual(payload.userData.success, true);
    assert.ok(payload.userData, 'Should contain userData');
  });

  test('should return 401 for invalid credentials', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/authentication/login',
      payload: {
        email: 'test@example.com',
        password: 'wrongpasswordlong'
      }
    });

    assert.strictEqual(response.statusCode, 401);
    const payload = JSON.parse(response.payload);
    assert.strictEqual(payload.error, 'Invalid email or password');
  });

  test('should return 400 if email or password are missing', async (t) => {
    const app = await build(t);

    const response = await app.inject({
      method: 'POST',
      url: '/api/authentication/login',
      payload: {
        email: 'test@example.com'
      }
    });

    assert.strictEqual(response.statusCode, 400);
  });

  test('should fail to access protected route without token', async (t) => {
    const app = await build(t);

    const response = await app.inject({
      method: 'GET',
      url: '/api/authentication/is-authenticated'
    });

    assert.strictEqual(response.statusCode, 401);
  });

  test('should return authenticated user data when a valid token is provided', async (t) => {
    const app = await build(t);

    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/authentication/login',
      payload: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    const { accessToken } = JSON.parse(loginRes.payload);

    const userRes = await app.inject({
      method: 'GET',
      url: '/api/authentication/user-authenticated',
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    assert.strictEqual(userRes.statusCode, 200);
    const userData = JSON.parse(userRes.payload);
    assert.ok(userData.id, 'Should contain user information');
  });

  test('should refresh the access token when a valid refresh token is provided', async (t) => {
    const app = await build(t);

    const mockRefreshToken = app.jwt.sign({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/authentication/refresh-token',
      payload: {
        refreshToken: mockRefreshToken
      }
    });

    const payload = JSON.parse(response.payload);
    assert.strictEqual(response.statusCode, 200);
    assert.ok(payload.refreshToken, 'Should return a new access token');
  });
});

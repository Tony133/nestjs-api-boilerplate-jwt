import { test, describe, after, before } from 'node:test';
import assert from 'node:assert';
import { build } from '../helper';

describe('Register Routes', async () => {
  let app: any;

  before(async (t: any) => {
    app = await build(t);
  });

  after(async () => {
    if (app) await app.close();
  });

  test('should successfully register a new user', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        firstName: 'Mario',
        lastName: 'Rossi',
        email: 'mario.rossi@example.com',
        password: 'Password123!',
        roles: ['USER'],
        dateOfRegistration: new Date().toISOString().split('T')[0],
        dateOfLastAccess: new Date().toISOString().split('T')[0]
      }
    });

    const payload = JSON.parse(response.payload);

    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(payload.email, 'mario.rossi@example.com');
    assert.ok(payload.id, 'User ID should be generated');
  });

  test('should return 400 for invalid email format', async (t) => {
    const app = await build(t);

    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        firstName: 'Mario',
        email: 'invalid-email',
        password: 'short'
      }
    });

    assert.strictEqual(response.statusCode, 400);
  });
});

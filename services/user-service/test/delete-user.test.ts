import axios from 'axios';
import sinon from 'sinon';
import { startWebServer, stopWebServer } from '../entry-points/api/server';
import * as testHelpers from './test-helpers';

let axiosAPIClient;

beforeAll(async () => {
  process.env.JWT_TOKEN_SECRET = testHelpers.exampleSecret;
  const apiConnection = await startWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true,
    headers: {
      authorization: testHelpers.signValidTokenWithDefaultUser(),
    },
  };
  axiosAPIClient = axios.create(axiosConfig);
});

beforeEach(() => {
  sinon.restore();
});

afterAll(async () => {
  stopWebServer();
});

describe('DELETE /user/:id', () => {
  test('When deleting a user it should not exist', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post('/user', userToAdd);

    // Delete user
    await axiosAPIClient.delete(`/user/${user.id}`);

    // Get same user
    const response = await axiosAPIClient.get(`/user/${user.id}`);

    // Check status
    expect(response.status).toBe(404);
  });

  test('When deleting an non-existing user should throw an error', async () => {
    const invalidUserId = -1;

    // Delete user
    const response = await axiosAPIClient.delete(`/user/${invalidUserId}`);

    // Check status
    expect(response.status).toBe(404);
  });
});

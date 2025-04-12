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

describe('GET /user/email/:email', () => {
  test('When asked for a user should return 200', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post(`/user`, userToAdd);

    // Get user
    const response = await axiosAPIClient.get(`/user/email/${user.email}`);

    // Check status
    expect(response.status).toBe(200);
  });

  test('When asked for an non-existing user should throw an error', async () => {
    const invalidUserEmail = 'invalid email';

    const response = await axiosAPIClient.get(
      `/user/email/${invalidUserEmail}`
    );

    // Check status
    expect(response.status).toBe(404);
  });
});

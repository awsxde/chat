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

describe('PUT /user', () => {
  test('When updating a user should return 200', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post('/user', userToAdd);

    // Update user
    const userToUpdate = {
      id: user.id,
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!1',
    };

    const response = await axiosAPIClient.put(
      `/user/${userToUpdate.id}`,
      userToUpdate
    );

    // Check status
    expect(response.status).toBe(200);
  });

  test('When updating an non-existing user should throw an error', async () => {
    // Create a user
    const userToUpdate = {
      id: -1,
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const response = await axiosAPIClient.put(
      `/user/${userToUpdate.id}`,
      userToUpdate
    );

    // Check status
    expect(response.status).toBe(404);
  });

  test('When password is not strong should throw an error', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post('/user', userToAdd);

    // Update user
    const userToUpdate = {
      id: user.id,
      email: testHelpers.generateValidEmail(),
      password: 'weak',
    };

    const response = await axiosAPIClient.put(
      `/user/${userToUpdate.id}`,
      userToUpdate
    );

    // Check status
    expect(response.status).toBe(400);
  });

  test('When email is not valid should throw an error', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post('/user', userToAdd);

    // Update user
    const userToUpdate = {
      id: user.id,
      email: 'test',
      password: 'StrongPass123!1',
    };

    const response = await axiosAPIClient.put(
      `/user/${userToUpdate.id}`,
      userToUpdate
    );

    // Check status
    expect(response.status).toBe(400);
  });
});

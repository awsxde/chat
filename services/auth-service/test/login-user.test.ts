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

describe('POST /auth/login', () => {
  test('When logging as a user should return 200', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    await axiosAPIClient.post('http://localhost:3001/user', userToAdd);

    // Login as user
    const response = await axiosAPIClient.post('/auth/login', userToAdd);

    // Check status
    expect(response.status).toBe(200);
  });

  test('When user does not exist should throw an error', async () => {
    // Login as user
    const userToLogin = {
      email: 'weak',
      password: 'StrongPass123!',
    };

    const response = await axiosAPIClient.post('/auth/login', userToLogin);

    // Assert
    expect(response.status).toBe(404);
  });

  test('When user exist but password is incorrect should throw an error', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post(
      'http://localhost:3001/user',
      userToAdd
    );

    // Login as user
    const userToLogin = {
      email: user.email,
      password: 'StrongPass12345676889!',
    };

    const response = await axiosAPIClient.post('/auth/login', userToLogin);

    // Check status
    expect(response.status).toBe(400);
  });
});

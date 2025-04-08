import axios from 'axios';
import sinon from 'sinon';
import { startWebServer, stopWebServer } from '../entry-points/api/server';
import * as testHelpers from './test-helpers';

// Configuring file-level HTTP client with base URL will allow
// all the tests to approach with a shortened syntax
let axiosAPIClient;

beforeAll(async () => {
  process.env.JWT_TOKEN_SECRET = testHelpers.exampleSecret;
  // ️️️✅ Best Practice: Place the backend under test within the same process
  const apiConnection = await startWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
    headers: {
      // ️️️✅ Best Practice: Test like production, include real token to stretch the real authentication mechanism
      authorization: testHelpers.signValidTokenWithDefaultUser(),
    },
  };
  axiosAPIClient = axios.create(axiosConfig);
});

beforeEach(() => {
  // ️️️✅ Best Practice: Start each test with a clean slate
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

export {};

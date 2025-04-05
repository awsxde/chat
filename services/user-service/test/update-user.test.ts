import axios from 'axios';
import nock from 'nock';
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

  // ️️️✅ Best Practice: Ensure that this component is isolated by preventing unknown calls
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  // ️️️✅ Best Practice: Start each test with a clean slate
  nock.cleanAll();
  sinon.restore();
});

afterAll(async () => {
  nock.enableNetConnect();
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

    const response = await axiosAPIClient.put('/user', userToUpdate);

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

    const response = await axiosAPIClient.put('/user', userToUpdate);

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

    const response = await axiosAPIClient.put('/user', userToUpdate);

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

    const response = await axiosAPIClient.put('/user', userToUpdate);

    // Check status
    expect(response.status).toBe(400);
  });
});

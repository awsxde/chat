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

  // ️️️✅ Best Practice: Ensure that this component is isolated by preventing unknown calls
  // nock.disableNetConnect();
  // nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  // ️️️✅ Best Practice: Start each test with a clean slate
  // nock.cleanAll();
  sinon.restore();
});

afterAll(async () => {
  // nock.enableNetConnect();
  stopWebServer();
});

// ️️️✅ Best Practice: Structure tests by routes and stories
describe('/auth', () => {
  describe('POST /login', () => {
    // ️️️✅ Best Practice: Check the response
    test('When logging a user, Then should get back approval with 200 response', async () => {
      // Arrange
      const userToAdd = {
        email: testHelpers.generateValidEmail(),
        password: 'StrongPass123!',
      };

      // Act
      await axiosAPIClient.post('http://localhost:3001/user', userToAdd);
      const { status } = await axiosAPIClient.post('/auth/login', userToAdd);

      // Assert
      expect(status).toBe(200);
    });

    test.skip('When user does not exist, throw error on login', async () => {
      // Arrange
      const userToLogin = {
        email: 'weak',
        password: 'StrongPass123!',
      };

      // Act
      const { status } = await axiosAPIClient.post('/auth/login', userToLogin);

      // Assert
      expect(status).toBe(400);
    });

    test('when user exist but password is incorrect, throw error on login', async () => {
      // Arrange
      const userEmail = testHelpers.generateValidEmail();

      const userToAdd = {
        email: userEmail,
        password: 'StrongPass123!',
      };

      const userToLogin = {
        email: userEmail,
        password: 'StrongPass12345676889!',
      };

      // Act
      await axiosAPIClient.post('http://localhost:3001/user', userToAdd);
      const { status } = await axiosAPIClient.post('/auth/login', userToLogin);

      // Assert
      expect(status).toBe(400);
    });
  });
});

export {};

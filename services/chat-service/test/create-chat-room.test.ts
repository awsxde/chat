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

  // nock.disableNetConnect();
  // nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  // nock.cleanAll();
  sinon.restore();
});

afterAll(async () => {
  // nock.enableNetConnect();
  stopWebServer();
});

describe('/api/chat', () => {
  describe('POST /chat', () => {
    test('When creating a new valid chat room, Then should get back approval with 201 response', async () => {
      // Arrange
      const userToAdd = {
        email: testHelpers.generateValidEmail(),
        password: 'StrongPass123!',
      };

      // Act
      const {
        data: { id: addedUserId },
      } = await axiosAPIClient.post('http://localhost:3001/user', userToAdd);

      // Arrange
      const chatRoomToCreate = {
        userIds: [addedUserId],
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post(
        '/chat-rooms',
        chatRoomToCreate
      );

      // Assert
      expect(receivedAPIResponse.status).toBe(201);
    });

    test('When creating a chat room without users, Then should get 400 response', async () => {
      // Arrange
      const chatRoomToCreate = {
        userIds: [],
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post(
        '/chat-rooms',
        chatRoomToCreate
      );

      // Assert
      expect(receivedAPIResponse.status).toBe(400);
    });

    test('When user does not exist, Then should return 404 error', async () => {
      const invalidUSerId = -1;

      // Arrange
      const chatRoomToCreate = {
        userIds: [invalidUSerId],
      };

      // Act
      const receivedAPIResponse = await axiosAPIClient.post(
        '/chat-rooms',
        chatRoomToCreate
      );

      // Assert
      expect(receivedAPIResponse.status).toBe(404);
    });
  });
});

export {};

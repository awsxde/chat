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

describe('deleteChatRoom', () => {
  test('When deleting an existing chat room, Then it should NOT be retrievable', async () => {
    // Create user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };
    const {
      data: { id: addedUserId },
    } = await axiosAPIClient.post('http://localhost:3001/user', userToAdd);

    // Create chat room
    const chatRoomToCreate = { userIds: [addedUserId] };
    const {
      data: { id: chatRoomId },
    } = await axiosAPIClient.post('/chat-rooms', chatRoomToCreate);

    // Delete the chat room
    await axiosAPIClient.delete(`/chat-rooms/${chatRoomId}`);

    // Verify deletion - should return 404
    const response = await axiosAPIClient.get(`/chat-rooms/${chatRoomId}`);

    // Assertions
    expect(response.status).toBe(404);
  });

  test('should throw an error when the chat room does not exist', async () => {
    // Arrange
    const chatRoomId = 2;

    // Act
    const response = await axiosAPIClient.delete(`/chat-rooms/${chatRoomId}`);

    // Assert
    expect(response.status).toBe(404);
  });
});

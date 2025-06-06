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

describe('send message', () => {
  test('When asked for an existing chat room, Then should retrieve it and receive 200 response', async () => {
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

    // Send message
    const data = {
      senderId: addedUserId,
      content: testHelpers.generateMessage(),
    };
    await axiosAPIClient.post(`/chat-rooms/${chatRoomId}/messages`, data);

    // Act
    const response = await axiosAPIClient.get(
      `/chat-rooms/${chatRoomId}/messages`
    );

    // Assert
    expect(response.status).toBe(200);
  });

  test('should throw an error when the chat room does not exist', async () => {
    const invalidChatRoomId = -1;

    // Act
    const response = await axiosAPIClient.get(
      `/chat-rooms/${invalidChatRoomId}/messages`
    );

    // Assert
    expect(response.status).toBe(404);
  });
});

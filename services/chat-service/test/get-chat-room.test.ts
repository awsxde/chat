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

describe('get /chat-rooms/:id', () => {
  test('When asked for a chat room should return 200', async () => {
    // Create a user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };

    const { data: user } = await axiosAPIClient.post(
      'http://localhost:3001/user',
      userToAdd
    );

    // Create a chat room
    const chatRoomToCreate = {
      userIds: [user.id],
    };

    const { data: chatRoom } = await axiosAPIClient.post(
      '/chat-rooms',
      chatRoomToCreate
    );

    // Get the chat room
    const response = await axiosAPIClient.get(`/chat-rooms/${chatRoom.id}`);

    // Check status
    expect(response.status).toBe(200);
  });

  test('should throw an error when the chat room does not exist', async () => {
    // Get the chat room
    const chatRoomId = -1;

    const response = await axiosAPIClient.get(`/chat-rooms/${chatRoomId}`);

    // Check status
    expect(response.status).toBe(404);
  });
});

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

describe('delete /chat-rooms/:id', () => {
  test('When deleting a chat room, Then it should NOT be retrievable', async () => {
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

    // Delete the chat room
    await axiosAPIClient.delete(`/chat-rooms/${chatRoom.id}`);

    // Find the chat room
    const response = await axiosAPIClient.get(`/chat-rooms/${chatRoom.id}`);

    // Check status
    expect(response.status).toBe(404);
  });

  test('When deleting an invalid chat room should throw an error', async () => {
    // Delete the chat room
    const chatRoomId = -1;

    const response = await axiosAPIClient.delete(`/chat-rooms/${chatRoomId}`);

    // Check status
    expect(response.status).toBe(404);
  });
});

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

describe('PUT /chat-rooms/:id', () => {
  test('When updating users of a chat room should return 200', async () => {
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

    // Update the chat room
    const chatRoomToUpdate = {
      id: chatRoom.id,
      userIds: [user.id],
    };

    const response = await axiosAPIClient.put(
      `/chat-rooms/${chatRoom.id}`,
      chatRoomToUpdate
    );

    // Check status
    expect(response.status).toBe(200);
  });

  test('When updating chat room with invalid users should throw an error', async () => {
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

    const invalidUserId = -1;

    // Update the chat room
    const chatRoomToUpdate = {
      id: chatRoom.id,
      userIds: [invalidUserId],
    };

    const response = await axiosAPIClient.put(
      `/chat-rooms/${chatRoom.id}`,
      chatRoomToUpdate
    );

    // Check status
    expect(response.status).toBe(404);
  });

  test('When updating a non-existent chat room should throw an error', async () => {
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

    const invalidChatRoomId = -1;

    // Update the chat room
    const chatRoomToUpdate = {
      id: invalidChatRoomId,
      userIds: [user.id],
    };

    const response = await axiosAPIClient.put(
      `/chat-rooms/${chatRoom.id}`,
      chatRoomToUpdate
    );

    // Check status
    expect(response.status).toBe(404);
  });
});

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
  test('When adding a message to an existing chat room, Then it should succeed', async () => {
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

    // Arrange
    const data = {
      senderId: addedUserId,
      content: testHelpers.generateMessage(),
    };

    // Act
    const response = await axiosAPIClient.post(
      `/chat-rooms/${chatRoomId}/messages`,
      data
    );

    // Assert
    expect(response.status).toBe(201);
  });

  test('When adding a message with a non-existent user id to chat room, Then it should return 404', async () => {
    // Create user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };
    const {
      data: { id: addedUserId },
    } = await axiosAPIClient.post('http://localhost:3001/user', userToAdd);

    const invalidUserId = -1;

    // Create chat room
    const chatRoomToCreate = { userIds: [addedUserId] };
    const {
      data: { id: chatRoomId },
    } = await axiosAPIClient.post('/chat-rooms', chatRoomToCreate);

    // Arrange
    const data = {
      senderId: invalidUserId,
      content: testHelpers.generateMessage(),
    };

    // Act
    const response = await axiosAPIClient.post(
      `/chat-rooms/${chatRoomId}/messages`,
      data
    );

    // Assert
    expect(response.status).toBe(404);
  });

  test('When adding a message to non-existent chat room, Then it should return 404', async () => {
    // Create user
    const userToAdd = {
      email: testHelpers.generateValidEmail(),
      password: 'StrongPass123!',
    };
    const {
      data: { id: addedUserId },
    } = await axiosAPIClient.post('http://localhost:3001/user', userToAdd);

    const invalidChatRoomId = -1;

    // Arrange
    const data = {
      senderId: addedUserId,
      content: testHelpers.generateMessage(),
    };

    // Act
    const response = await axiosAPIClient.post(
      `/chat-rooms/${invalidChatRoomId}/messages`,
      data
    );

    // Assert
    expect(response.status).toBe(404);
  });
});

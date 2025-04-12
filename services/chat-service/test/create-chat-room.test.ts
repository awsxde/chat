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

describe('POST /chat-rooms', () => {
  test('When creating a chat room should return 201', async () => {
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

    const response = await axiosAPIClient.post('/chat-rooms', chatRoomToCreate);

    // Check status
    expect(response.status).toBe(201);
  });

  test('When creating a chat room without users should throw an error', async () => {
    // Create a chat room
    const chatRoomToCreate = {
      userIds: [],
    };

    const response = await axiosAPIClient.post('/chat-rooms', chatRoomToCreate);

    // Check status
    expect(response.status).toBe(400);
  });

  test('When creating a chat room with invalid users should throw an error', async () => {
    const invalidUSerId = -1;

    // Create a chat room
    const chatRoomToCreate = {
      userIds: [invalidUSerId],
    };

    // Act
    const response = await axiosAPIClient.post('/chat-rooms', chatRoomToCreate);

    // Assert
    expect(response.status).toBe(404);
  });
});

import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import { addUserToChatRoom } from '../../domain/use-case/add-user-to-chat-room-use-case';
import { createChatRoom } from '../../domain/use-case/create-chat-room-use-case';
import { deleteChatRoom } from '../../domain/use-case/delete-chat-room-use-case';
import { deleteMessage } from '../../domain/use-case/delete-message-use-case';
import { getChatRoom } from '../../domain/use-case/get-chat-room-use-case';
import { getMessages } from '../../domain/use-case/get-messages-use-case';
import { removeUserFromChatRoom } from '../../domain/use-case/remove-user-from-chat-room-use-case';
import { sendMessage } from '../../domain/use-case/send-message-use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  // Create a chat room
  router.post('/', async (req, res, next) => {
    try {
      logger.info(`Chat API: Creating a chat room ${util.inspect(req.body)}`);
      const chatRoom = await createChatRoom(req.body);
      return res.status(201).json(chatRoom);
    } catch (error) {
      next(error);
    }
  });

  // Get a chat room by ID
  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`Chat API: Fetching chat room with ID ${req.params.id}`);
      const chatRoom = await getChatRoom(parseInt(req.params.id, 10));

      if (!chatRoom) {
        return res.status(404).json({ error: 'Chat room not found' });
      }

      return res.json(chatRoom);
    } catch (error) {
      next(error);
    }
  });

  // Delete a chat room
  router.delete('/:id', async (req, res, next) => {
    try {
      logger.info(`Chat API: Deleting chat room with ID ${req.params.id}`);
      await deleteChatRoom(parseInt(req.params.id, 10));
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Add a user to a chat room
  router.post('/:id/users/:userId', async (req, res, next) => {
    try {
      logger.info(
        `Chat API: Adding user ${req.params.userId} to chat room ${req.params.id}`
      );
      const result = await addUserToChatRoom(
        parseInt(req.params.id, 10),
        parseInt(req.params.userId, 10)
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  // Remove a user from a chat room
  router.delete('/:id/users/:userId', async (req, res, next) => {
    try {
      logger.info(
        `Chat API: Removing user ${req.params.userId} from chat room ${req.params.id}`
      );
      await removeUserFromChatRoom(
        parseInt(req.params.id, 10),
        parseInt(req.params.userId, 10)
      );
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Send a message in a chat room
  router.post('/:id/messages', async (req, res, next) => {
    try {
      logger.info(`Chat API: Sending message in chat room ${req.params.id}`);
      const message = await sendMessage(parseInt(req.params.id, 10), req.body);
      return res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  });

  // Get messages in a chat room
  router.get('/:id/messages', async (req, res, next) => {
    try {
      logger.info(`Chat API: Fetching messages for chat room ${req.params.id}`);
      const messages = await getMessages(parseInt(req.params.id, 10));
      return res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  // Delete a message
  router.delete('/:id/messages/:messageId', async (req, res, next) => {
    try {
      logger.info(
        `Chat API: Deleting a message with ID ${req.params.messageId}`
      );
      const messages = await deleteMessage(parseInt(req.params.messageId, 10));
      return res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/chat-rooms', router);
}

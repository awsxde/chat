import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import {
  createChatRoomUseCase,
  deleteChatRoomUseCase,
  deleteUserFromChatRoomUseCase,
  findChatRoomUseCase,
  updateChatRoomUseCase,
} from '../../domain/use-case/chat-room';
import {
  createMessageUseCase,
  deleteMessageUseCase,
  findMessagesUseCase,
} from '../../domain/use-case/message';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      logger.info(`Chat API: creating a chat room ${util.inspect(req.body)}`);
      const response = await createChatRoomUseCase(req.body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      logger.info(`Chat API: updating a chat room ${util.inspect(req.body)}`);
      const response = await updateChatRoomUseCase(req.body);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`Chat API: finding chat room with id ${req.params.id}`);
      const response = await findChatRoomUseCase(parseInt(req.params.id, 10));
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      logger.info(`Chat API: deleting chat room with id ${req.params.id}`);
      await deleteChatRoomUseCase(parseInt(req.params.id, 10));
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id/users/:userId', async (req, res, next) => {
    try {
      logger.info(
        `Chat API: deleting user with id ${req.params.userId} from chat room ${req.params.id}`
      );
      await deleteUserFromChatRoomUseCase(
        parseInt(req.params.id, 10),
        parseInt(req.params.userId, 10)
      );
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/messages', async (req, res, next) => {
    try {
      logger.info(`Chat API: creating a message in chat room ${req.params.id}`);
      const response = await createMessageUseCase(
        parseInt(req.params.id, 10),
        req.body
      );
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id/messages', async (req, res, next) => {
    try {
      logger.info(`Chat API: finding messages for chat room ${req.params.id}`);
      const response = await findMessagesUseCase(parseInt(req.params.id, 10));
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id/messages/:messageId', async (req, res, next) => {
    try {
      logger.info(
        `Chat API: deleting a message with id ${req.params.messageId}`
      );
      await deleteMessageUseCase(
        parseInt(req.params.id, 10),
        parseInt(req.params.messageId, 10)
      );
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/chat-rooms', router);
}

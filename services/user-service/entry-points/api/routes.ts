import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import {
  createUserUseCase,
  deleteUserUseCase,
  findUserByEmailUseCase,
  findUserByIdUseCase,
  updateUserUseCase,
} from '../../domain/use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      logger.info(`User API: creating a new user ${util.inspect(req.body)}`);
      const response = await createUserUseCase(req.body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      logger.info(`User API: updating a user ${util.inspect(req.body)}`);
      const response = await updateUserUseCase(req.body);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`User API: finding user with id ${req.params.id}`);
      const response = await findUserByIdUseCase(parseInt(req.params.id, 10));
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/email/:email', async (req, res, next) => {
    try {
      logger.info(`User API: finding user with email ${req.params.email}`);
      const response = await findUserByEmailUseCase(req.params.email);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      logger.info(`User API: deleting user with id ${req.params.id}`);
      await deleteUserUseCase(parseInt(req.params.id, 10));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/user', router);
}

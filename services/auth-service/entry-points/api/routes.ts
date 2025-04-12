import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import { loginUserUseCase } from '../../domain/use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/login', async (req, res, next) => {
    try {
      logger.info(`User API: logging in as a user ${util.inspect(req.body)}`);
      const response = await loginUserUseCase(req.body);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/auth', router);
}

import { Static, Type } from '@sinclair/typebox';

export const userSchema = Type.Object({
  id: Type.Integer(),
  email: Type.String(),
  password: Type.String(),
});

export const createUserSchema = Type.Omit(userSchema, ['id']);

export type createUserDTO = Static<typeof createUserSchema>;

export type updateUserDTO = Static<typeof userSchema>;

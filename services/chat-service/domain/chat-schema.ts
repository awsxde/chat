import { Static, Type } from '@sinclair/typebox';

export const chatRoomSchema = Type.Object({
  id: Type.Integer(),
  userIds: Type.Array(Type.Integer()),
});

export const createChatRoomSchema = Type.Omit(chatRoomSchema, ['id']);

export type createChatRoomDTO = Static<typeof createChatRoomSchema>;

export const messageSchema = Type.Object({
  id: Type.Integer(),
  senderId: Type.Integer(),
  content: Type.String(),
});

export const createMessageSchema = Type.Omit(messageSchema, ['id']);

export type createMessageDTO = Static<typeof createMessageSchema>;

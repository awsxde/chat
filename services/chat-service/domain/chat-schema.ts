import { Static, Type } from '@sinclair/typebox';

export const chatRoomSchema = Type.Object({
  id: Type.Integer(),
  userIds: Type.Array(Type.Integer()),
});

export const createChatRoomSchema = Type.Object({
  userIds: Type.Array(Type.Integer()),
});

export const messageSchema = Type.Object({
  senderId: Type.Integer(),
  content: Type.String(),
});

export type createChatRoomDTO = Static<typeof createChatRoomSchema>;

export type createMessageDTO = Static<typeof messageSchema>;

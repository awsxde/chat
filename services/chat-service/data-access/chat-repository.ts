import { getPrismaClient } from './prisma-client-factory';

// ✅ Create a new chat room with multiple users
export async function createChatRoom(userIds: number[]) {
  const newChatRoom = await getPrismaClient().chatRoom.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });

  return newChatRoom;
}

// ✅ Get a chat room by ID (with users & messages)
export async function getChatRoomById(chatRoomId: number) {
  const chatRoom = await getPrismaClient().chatRoom.findUnique({
    where: { id: chatRoomId },
    include: { users: true, messages: true },
  });

  return chatRoom;
}

// ✅ Add a user to a chat room
export async function addUserToChatRoom(chatRoomId: number, userId: number) {
  const updatedChatRoom = await getPrismaClient().chatRoom.update({
    where: { id: chatRoomId },
    data: {
      users: { connect: { id: userId } },
    },
  });

  return updatedChatRoom;
}

// ✅ Remove a user from a chat room
export async function removeUserFromChatRoom(
  chatRoomId: number,
  userId: number
) {
  const updatedChatRoom = await getPrismaClient().chatRoom.update({
    where: { id: chatRoomId },
    data: {
      users: { disconnect: { id: userId } },
    },
  });

  return updatedChatRoom;
}

// ✅ Send a message in a chat room
export async function sendMessage(
  chatRoomId: number,
  senderId: number,
  content: string
) {
  const newMessage = await getPrismaClient().message.create({
    data: {
      chatRoomId,
      senderId,
      content,
    },
  });

  return newMessage;
}

// ✅ Get all messages in a chat room (ordered by creation time)
export async function getMessages(chatRoomId: number) {
  const messages = await getPrismaClient().message.findMany({
    where: { chatRoomId },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

// ✅ Get message in a chat room
export async function getMessage(messageId: number) {
  const messages = await getPrismaClient().message.findMany({
    where: { id: messageId },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

// ✅ Delete a message
export async function deleteMessage(messageId: number) {
  const deletedMessage = await getPrismaClient().message.delete({
    where: { id: messageId },
  });

  return deletedMessage;
}

// ✅ Delete a chat room
export async function deleteChatRoom(chatRoomId: number) {
  const deletedChatRoom = await getPrismaClient().chatRoom.delete({
    where: { id: chatRoomId },
  });

  return deletedChatRoom;
}

import { getPrismaClient } from './prisma-client-factory';

type chatRoomRecord = {
  id: number;
  userIds: number[];
};

export async function createChatRoomRepo(
  newChatRoomRequest: Omit<chatRoomRecord, 'id'>
) {
  const newChatRoom = await getPrismaClient().chatRoom.create({
    data: {
      users: {
        connect: newChatRoomRequest.userIds.map((id) => ({ id })),
      },
    },
  });

  return newChatRoom;
}

export async function updateChatRoomRepo(chatRoomRequest: chatRoomRecord) {
  const updatedChatRoom = await getPrismaClient().chatRoom.update({
    where: { id: chatRoomRequest.id },
    data: {
      users: {
        connect: chatRoomRequest.userIds.map((id) => ({ id })),
      },
    },
  });

  return updatedChatRoom;
}

export async function findChatRoomByIdRepo(id: number) {
  const chatRoom = await getPrismaClient().chatRoom.findUnique({
    where: { id },
    include: { users: true, messages: true },
  });

  return chatRoom;
}

export async function deleteUserFromChatRoomRepo(
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

export async function createMessageRepo(
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

export async function findMessagesRepo(chatRoomId: number) {
  const messages = await getPrismaClient().message.findMany({
    where: { chatRoomId },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

export async function findMessageRepo(messageId: number) {
  const messages = await getPrismaClient().message.findUnique({
    where: { id: messageId },
  });

  return messages;
}

export async function deleteMessageRepo(messageId: number) {
  const deletedMessage = await getPrismaClient().message.delete({
    where: { id: messageId },
  });

  return deletedMessage;
}

export async function deleteChatRoomRepo(chatRoomId: number) {
  const deletedChatRoom = await getPrismaClient().chatRoom.delete({
    where: { id: chatRoomId },
  });

  return deletedChatRoom;
}

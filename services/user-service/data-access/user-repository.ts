import { getPrismaClient } from './prisma-client-factory';

// ️️️✅ Best Practice: The repository pattern - This is a plain JS object (POJO) that is returned to the domain layer
// This way, the domain/business-logic can focus on its business and avoid delving into DB/ORM narratives
type UserRecord = {
  id: number;
  email: string;
  password: string;
};

// ️️️✅ Best Practice: The repository pattern - Wrap the entire DB layer with a simple interface that returns plain JS objects
export async function createUserRepo(newUserRequest: Omit<UserRecord, 'id'>) {
  const resultUser = await getPrismaClient().user.create({
    data: { ...newUserRequest },
  });

  return resultUser;
}

export async function updateUserRepo(updateUserRequest: UserRecord) {
  const resultUser = await getPrismaClient().user.update({
    where: { id: updateUserRequest.id },
    data: { ...updateUserRequest },
  });

  return resultUser;
}

export async function findUserByEmailRepo(email: string) {
  const resultUser = await getPrismaClient().user.findUnique({
    where: {
      email,
    },
  });

  return resultUser;
}

export async function findUserByIdRepo(id: number) {
  const resultUser = await getPrismaClient().user.findUnique({
    where: {
      id,
    },
  });

  return resultUser;
}

export async function deleteUserRepo(id: number) {
  const deleteResult = await getPrismaClient().user.delete({
    where: {
      id,
    },
  });

  return deleteResult;
}

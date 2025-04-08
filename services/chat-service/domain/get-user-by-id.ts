import { AppError } from '@practica/error-handling';
import axios from 'axios';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM4NTIyMTk5NzEsImRhdGEiOnsidXNlciI6ImpvZSIsInJvbGVzIjoiYWRtaW4ifSwiaWF0IjoxNzEyMjUyMjE5fQ.kUS7AnwtGum40biJYt0oyOH_le1KfVD2EOrs-ozclY0';

export async function getUserById(id: number) {
  const response = await axios
    .get(`http://localhost:3001/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
      if (error.response.status === 404) {
        throw new AppError(
          'user-does-not-exist',
          `User with id ${id} does not exist`,
          404,
          false
        );
      }
    });

  return response!.data;
}

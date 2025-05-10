import type { User, UserWithoutPassword } from '~/types/user';

const users: User[] = [
  {
    id: 'admin',
    name : 'Admin',
    email: 'admin@gmail.com',
    password: 'qwer1234',
    roles: ['ADMIN'],
  },
  {
    id: 'gitae',
    name : 'Gitae',
    email: 'user@gmail.com',
    password: 'qwer1234',
    roles: ['USER'],
  },
];

export const getUser = ( id: string, password: string,): Maybe<UserWithoutPassword> => {
  console.log(`getUser called with id: ${id}, password: ${password}`);
  const foundUser = users.find(
    (u) => u.id === id && u.password === password,
  );
  if (foundUser) {
    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      roles: foundUser.roles,
    };
  }
};
export default users;
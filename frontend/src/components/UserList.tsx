import React from 'react';
import { List } from 'grommet';

type User = {
  id: number;
  nome: string;
  email: string;
  idade: number;
};

interface Props {
  users: User[];
}

export function UserList({ users }: Props) {
  return (
    <List
      data={users}
      primaryKey="nome"
      secondaryKey={user => <span>{user.email} — {user.idade} anos</span>}
    />
  );
}
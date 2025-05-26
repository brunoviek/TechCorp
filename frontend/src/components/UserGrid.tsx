import React from 'react';
import { DataTable, Box, Text, Button, ResponsiveContext } from 'grommet';
import { Edit, Trash } from 'grommet-icons';

type User = {
  id: number;
  nome: string;
  email: string;
  idade: number;
};

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserGrid({ users, onEdit, onDelete }: Props) {
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          width={size === 'small' ? '100vw' : 'xlarge'}
          alignSelf="center"
        >
          <DataTable
            columns={[
              { property: 'id', header: <Text>ID</Text>, primary: true },
              { property: 'nome', header: <Text>Nome</Text> },
              { property: 'email', header: <Text>Email</Text> },
              { property: 'idade', header: <Text>Idade</Text> },
              {
                property: 'actions',
                header: <Text>Ações</Text>,
                render: datum => (
                  <Box direction="row" gap="small">
                    <Button
                      icon={<Edit color="plain" />}
                      onClick={() => onEdit(datum)}
                      plain
                      hoverIndicator
                      title="Editar"
                    />
                    <Button
                      icon={<Trash color="status-critical" />}
                      onClick={() => onDelete(datum)}
                      plain
                      hoverIndicator
                      title="Excluir"
                    />
                  </Box>
                ),
              },
            ]}
            data={users}
            step={10}
            pad="small"
            background={{ header: 'light-3', body: 'white' }}
            border={{ header: true, body: true, footer: true }}
            fill={false}
            resizeable
          />
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Spinner,
  Notification,
  Button,
  Pagination,
  Select,
  Text,
  ResponsiveContext,
} from 'grommet';
import { Add, UserAdd } from 'grommet-icons';
import { getUsers, createUser, deleteUser, updateUser } from '../api/users';
import { UserGrid } from '../components/UserGrid';
import { UserForm } from '../components/UserForm';

const pageSizeOptions = [1, 10, 100];

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(pageSizeOptions[1]);

  const fetchUsers = (pageNumber = 1, pageLimit = limit) => {
    setLoading(true);
    getUsers(pageNumber, pageLimit)
      .then(res => {
        setUsers(res.data.data.users || []);
        setTotal(res.data.data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar usuários');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  const handleCreateUser = (data: { nome: string; email: string; idade: number }) => {
    createUser(data)
      .then(() => {
        setShowModal(false);
        fetchUsers(page, limit);
      })
      .catch(() => setError('Erro ao criar usuário'));
  };

  const handleEditUser = (user: any) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user: any) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.nome}"?`)) {
      deleteUser(user.id)
        .then(() => fetchUsers(page, limit))
        .catch(() => setError('Erro ao excluir usuário'));
    }
  };

  const handleUpdateUser = (data: { nome: string; email: string; idade: number }) => {
    if (!editUser) return;
    updateUser(editUser.id, data)
      .then(() => {
        setShowModal(false);
        setEditUser(null);
        fetchUsers(page, limit);
      })
      .catch(() => setError('Erro ao editar usuário'));
  };

  const handleGenerateRandomUser = () => {
    const randomIdade = Math.floor(Math.random() * 60) + 18;
    const randomNome = `Usuário${Math.floor(Math.random() * 10000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@mail.com`;
    createUser({ nome: randomNome, email: randomEmail, idade: randomIdade })
      .then(() => fetchUsers(page, limit))
      .catch(() => setError('Erro ao criar usuário aleatório'));
  };

  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          pad={size === 'small' ? 'small' : 'large'}
          align="center"
          background="light-2"
        >
          <Box
            direction={size === 'small' ? 'column' : 'row'}
            align={size === 'small' ? 'stretch' : 'center'}
            justify="between"
            width={size === 'small' ? '100%' : 'xlarge'}
            gap="medium"
            margin={{ bottom: 'medium' }}
          >
            <Heading level={2} margin="none" size={size === 'small' ? 'small' : 'medium'}>
              Usuários
            </Heading>
            <Box direction="row" gap="small" justify="end" margin={{ top: size === 'small' ? 'small' : undefined }}>
              <Button
                icon={<Add />}
                label="Novo Usuário"
                primary
                onClick={() => {
                  setEditUser(null);
                  setShowModal(true);
                }}
              />
              <Button
                icon={<UserAdd />}
                label="Gerar Usuário Aleatório"
                onClick={handleGenerateRandomUser}
                secondary
              />
            </Box>
          </Box>
          <Box
            direction={size === 'small' ? 'column' : 'row'}
            gap="small"
            align="center"
            margin={{ bottom: 'small' }}
            width={size === 'small' ? '100%' : 'xlarge'}
          >
            <Text>Registros por página:</Text>
            <Select
              options={pageSizeOptions}
              value={limit}
              onChange={({ option }) => {
                setLimit(option);
                setPage(1);
              }}
            />
          </Box>
          {loading && <Spinner />}
          {error && (
            <Notification
              toast
              status="critical"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {!loading && !error && (
            <>
              <UserGrid
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
              <Box align="center" margin={{ top: 'medium' }}>
                <Pagination
                  numberItems={total}
                  page={page}
                  step={limit}
                  onChange={({ page: nextPage }) => setPage(nextPage ?? 1)}
                  size="medium"
                  alignSelf="center"
                />
              </Box>
            </>
          )}
          {showModal && (
            <UserForm
              onClose={() => {
                setShowModal(false);
                setEditUser(null);
              }}
              onSubmit={editUser ? handleUpdateUser : handleCreateUser}
              initialValue={editUser || undefined}
            />
          )}
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}
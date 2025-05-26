import { ListUsersQueryHandler } from './ListUsersQueryHandler';

describe('ListUsersQueryHandler', () => {
  let userRepository: any;
  let handler: ListUsersQueryHandler;

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
    };
    handler = new ListUsersQueryHandler(userRepository);
  });

  it('deve retornar a lista de usuários paginada', async () => {
    const users = [
      { id: 1, nome: 'João', email: 'joao@email.com', idade: 30 },
      { id: 2, nome: 'Maria', email: 'maria@email.com', idade: 25 },
    ];
    userRepository.findAll.mockResolvedValue(users);

    const result = await handler.execute(1, 10);

    expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(users);
  });

  it('deve retornar lista vazia se não houver usuários', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await handler.execute(2, 10);

    expect(userRepository.findAll).toHaveBeenCalledWith(2, 10);
    expect(result).toEqual([]);
  });
});
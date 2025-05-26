import { GetUserByIdQueryHandler } from './GetUserByIdQueryHandler';

describe('GetUserByIdQueryHandler', () => {
  let userRepository: any;
  let handler: GetUserByIdQueryHandler;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    };
    handler = new GetUserByIdQueryHandler(userRepository);
  });

  it('deve retornar o usuário se encontrado', async () => {
    const user = { id: 1, nome: 'João', email: 'joao@email.com', idade: 30 };
    userRepository.findById.mockResolvedValue(user);

    const result = await handler.execute(1);

    expect(userRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it('deve retornar null se usuário não encontrado', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await handler.execute(2);

    expect(userRepository.findById).toHaveBeenCalledWith(2);
    expect(result).toBeNull();
  });
});
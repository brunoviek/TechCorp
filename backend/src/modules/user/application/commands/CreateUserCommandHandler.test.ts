import { CreateUserCommandHandler } from './CreateUserCommandHandler';

describe('CreateUserCommandHandler', () => {
  let userRepository: any;
  let handler: CreateUserCommandHandler;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    handler = new CreateUserCommandHandler(userRepository);
  });

  it('deve criar usuário se email não cadastrado', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(undefined);

    await handler.execute('João', 'joao@email.com', 30);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('joao@email.com');
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('deve lançar erro se email já cadastrado', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'joao@email.com' });

    await expect(
      handler.execute('João', 'joao@email.com', 30)
    ).rejects.toThrow('E-mail já cadastrado.');
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
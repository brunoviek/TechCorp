import { EditUserCommandHandler } from './EditUserCommandHandler';
import { User } from '../../domain/entities/User';

describe('EditUserCommandHandler', () => {
  let userRepository: any;
  let handler: EditUserCommandHandler;

  beforeEach(() => {
    userRepository = {
      update: jest.fn(),
    };
    handler = new EditUserCommandHandler(userRepository);
  });

  it('deve chamar o repositório para atualizar o usuário', async () => {
    userRepository.update.mockResolvedValue(undefined);

    await handler.execute(1, 'Maria', 'maria@email.com', 25);

    expect(userRepository.update).toHaveBeenCalledWith(
      new User(1, 'Maria', 'maria@email.com', 25)
    );
  });
});
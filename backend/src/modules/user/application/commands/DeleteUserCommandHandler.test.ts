import { DeleteUserCommandHandler } from './DeleteUserCommandHandler';

describe('DeleteUserCommandHandler', () => {
  let userRepository: any;
  let handler: DeleteUserCommandHandler;

  beforeEach(() => {
    userRepository = {
      delete: jest.fn(),
    };
    handler = new DeleteUserCommandHandler(userRepository);
  });

  it('deve chamar o repositório para deletar o usuário', async () => {
    userRepository.delete.mockResolvedValue(undefined);

    await handler.execute(123);

    expect(userRepository.delete).toHaveBeenCalledWith(123);
  });
});
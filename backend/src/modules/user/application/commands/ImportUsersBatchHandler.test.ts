import fs from 'fs';
import path from 'path';
import { ImportUsersBatchHandler } from './ImportUsersBatchHandler';
import { CreateUserCommandHandler } from './CreateUserCommandHandler';

jest.mock('./CreateUserCommandHandler');

const mockCreateUser = jest.fn();
(CreateUserCommandHandler as any).mockImplementation(() => ({
  execute: mockCreateUser,
}));

describe('ImportUsersBatchHandler', () => {
  let handler: ImportUsersBatchHandler;
  let userRepository: any;
  const mocksDir = path.join(__dirname, '__mocks__');

  beforeAll(() => {
    if (!fs.existsSync(mocksDir)) {
      fs.mkdirSync(mocksDir);
    }
  });

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    handler = new ImportUsersBatchHandler(new CreateUserCommandHandler(userRepository) as any);
    mockCreateUser.mockReset();
  });

  it('importa usuários válidos com sucesso', async () => {
    mockCreateUser.mockResolvedValue(undefined);
    const filePath = path.join(__dirname, '__mocks__', 'valid.csv');
    fs.writeFileSync(filePath, 'nome,email,idade\nJoão,joao@email.com,30');
    const result = await handler.execute(filePath);
    expect(result.successCount).toBe(1);
    expect(result.errorCount).toBe(0);
    expect(result.errors.length).toBe(0);
  });

  it('retorna erro para cabeçalho inválido', async () => {
    const filePath = path.join(__dirname, '__mocks__', 'invalid_header.csv');
    fs.writeFileSync(filePath, 'nome,email\nJoão,joao@email.com');
    await expect(handler.execute(filePath)).rejects.toThrow(/Cabeçalho do CSV inválido/);
  });

  it('retorna erro para usuário já cadastrado', async () => {
    mockCreateUser.mockRejectedValue(new Error('E-mail já cadastrado.'));
    const filePath = path.join(__dirname, '__mocks__', 'duplicate.csv');
    fs.writeFileSync(filePath, 'nome,email,idade\nJoão,joao@email.com,30');
    const result = await handler.execute(filePath);
    expect(result.successCount).toBe(0);
    expect(result.errorCount).toBe(1);
    expect(result.errors[0].message).toMatch(/E-mail já cadastrado/);
  });
});
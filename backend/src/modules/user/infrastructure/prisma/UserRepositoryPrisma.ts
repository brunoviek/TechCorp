import { prisma } from '../../../../shared/infra/database/prisma-client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepositoryPrisma implements IUserRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        nome: user.nome,
        email: user.email,
        idade: user.idade,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return new User(data.id, data.nome, data.email, data.idade);
  }
}

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

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit }),
      prisma.user.count()
    ]);
    return {
      users: users.map(u => new User(u.id, u.nome, u.email, u.idade)),
      total
    };
  }
}

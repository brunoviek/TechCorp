import { User } from '../entities/User';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;
  update(user: User): Promise<void>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<User | null>;
}

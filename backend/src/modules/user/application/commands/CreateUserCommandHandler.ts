import { injectable, inject } from "inversify";
import TYPES from '../../../../types';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Log } from '../../../../shared/infra/decorators/Log';

@injectable()
export class CreateUserCommandHandler {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  @Log
  async execute(nome: string, email: string, idade: number) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado.');
    }
    const user = new User(0, nome, email, idade);
    await this.userRepository.create(user);
  }
}

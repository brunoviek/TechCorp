import { injectable, inject } from "inversify";
import TYPES from '../../../../types';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class CreateUserCommandHandler {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(nome: string, email: string, idade: number) {
    const user = new User(0, nome, email, idade);
    await this.userRepository.create(user);
  }
}

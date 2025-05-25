import { injectable, inject } from "inversify";
import TYPES from '../../../../types';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Log } from '../../../../shared/infra/decorators/Log';
import { User } from '../../domain/entities/User';

@injectable()
export class EditUserCommandHandler {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  @Log
  async execute(id: number, nome: string, email: string, idade: number) {
    const user = new User(id, nome, email, idade);
    await this.userRepository.update(user);
  }
}
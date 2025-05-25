import { injectable, inject } from "inversify";
import TYPES from '../../../../types';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Log } from '../../../../shared/infra/decorators/Log';

@injectable()
export class ListUsersQueryHandler {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  @Log
  async execute(page: number, limit: number) {
    return this.userRepository.findAll(page, limit);
  }
}
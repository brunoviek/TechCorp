import { injectable, inject } from "inversify";
import TYPES from '../../../../types';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Log } from '../../../../shared/infra/decorators/Log';

@injectable()
export class GetUserByIdQueryHandler {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  @Log
  async execute(id: number) {
    return this.userRepository.findById(id);
  }
}
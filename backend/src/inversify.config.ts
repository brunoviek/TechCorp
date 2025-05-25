import { Container } from "inversify";
import TYPES from "./types";
import { IUserRepository } from "./modules/user/domain/repositories/IUserRepository";
import { UserRepositoryPrisma } from "./modules/user/infrastructure/prisma/UserRepositoryPrisma";
import { CreateUserCommandHandler } from "./modules/user/application/commands/CreateUserCommandHandler";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryPrisma);
container.bind<CreateUserCommandHandler>(CreateUserCommandHandler).toSelf();

export { container };
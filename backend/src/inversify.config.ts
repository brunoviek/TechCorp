import { Container } from "inversify";
import TYPES from "./types";
import { IUserRepository } from "./modules/user/domain/repositories/IUserRepository";
import { UserRepositoryPrisma } from "./modules/user/infrastructure/prisma/UserRepositoryPrisma";
import { CreateUserCommandHandler } from "./modules/user/application/commands/CreateUserCommandHandler";
import { ListUsersQueryHandler } from "./modules/user/application/queries/ListUsersQueryHandler";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryPrisma);
container.bind<CreateUserCommandHandler>(CreateUserCommandHandler).toSelf();
container.bind<ListUsersQueryHandler>(ListUsersQueryHandler).toSelf();

export { container };
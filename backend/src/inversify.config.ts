import { Container } from "inversify";
import TYPES from "./types";
import { IUserRepository } from "./modules/user/domain/repositories/IUserRepository";
import { UserRepositoryPrisma } from "./modules/user/infrastructure/prisma/UserRepositoryPrisma";
import { CreateUserCommandHandler } from "./modules/user/application/commands/CreateUserCommandHandler";
import { ListUsersQueryHandler } from "./modules/user/application/queries/ListUsersQueryHandler";
import { EditUserCommandHandler } from "./modules/user/application/commands/EditUserCommandHandler";
import { DeleteUserCommandHandler } from "./modules/user/application/commands/DeleteUserCommandHandler";
import { GetUserByIdQueryHandler } from "./modules/user/application/queries/GetUserByIdQueryHandler";
import { ImportUsersBatchHandler } from "./modules/user/application/commands/ImportUsersBatchHandler";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryPrisma);
container.bind<CreateUserCommandHandler>(CreateUserCommandHandler).toSelf();
container.bind<ListUsersQueryHandler>(ListUsersQueryHandler).toSelf();
container.bind<EditUserCommandHandler>(EditUserCommandHandler).toSelf();
container.bind<DeleteUserCommandHandler>(DeleteUserCommandHandler).toSelf();
container.bind<GetUserByIdQueryHandler>(GetUserByIdQueryHandler).toSelf();
container.bind<ImportUsersBatchHandler>(ImportUsersBatchHandler).toSelf();

export { container };
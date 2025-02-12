import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";

import { UserController } from "../../domain/interfaces/UserController";
import { UserControllerImpl } from "../../adapters/controllers/UserControllerImpl";
import { VendorController } from "../../domain/interfaces/VendorController";
import { VendorControllerImpl } from "../../adapters/controllers/VendorControllerImpl";
import { AuthController } from "../../domain/interfaces/AuthController";
import { AuthControllerImpl } from "../../adapters/controllers/AuthControllerImpl";
import { VendorTypeController } from "../../domain/interfaces/VendorTypeController";
import { VendorTypeControllerImpl } from "../../adapters/controllers/VendorTypeControllerImpl";
import { PostController } from "../../domain/interfaces/PostController";
import { PostControllerImpl } from "../../adapters/controllers/PostControllerImpl";
import { ConversationController } from "../../domain/interfaces/ConversationController";
import { ConversationControllerImpl } from "../../adapters/controllers/ConversationControllerImpl";
import { NotificationController } from "../../domain/interfaces/NotificationController";
import { NotificationControllerImpl } from "../../adapters/controllers/NotificationControllerImpl";
import { BookingController } from "../../domain/interfaces/BookingController";
import { BookingControllerImpl } from "../../adapters/controllers/BookingControllerImpl";
import { MessageController } from "../../domain/interfaces/MessageController";
import { MessageControllerImpl } from "../../adapters/controllers/MessageController";

import { AdminRepository } from "../../domain/interfaces/AdminRepository";
import { AdminRepositoryImpl } from "../odm/repositories/AdminRepositoryImpl";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { UserRepositoryImpl } from "../odm/repositories/UserRepositoryImpl";
import { VendorRepository } from "../../domain/interfaces/VendorRepository";
import { VendorRepositoryImpl } from "../odm/repositories/VendorRepositoryImpl";
import { NotificationRepository } from "../../domain/interfaces/NotificationRepository";
import { NotificationRepositoryImpl } from"../odm/repositories/NotificationRepositoryImpl";
import { TypeRepository } from "../../domain/interfaces/TypeRepository";
import { TypeRepositoryImpl } from"../odm/repositories/TypeRepositoryImpl";
import { PostRepository } from "../../domain/interfaces/PostRepository";
import { PostRepositoryImpl } from"../odm/repositories/PostRepositoryImpl";
import { ConversationRepository } from "../../domain/interfaces/ConversationRepository";
import { ConversationRepositoryImpl } from"../odm/repositories/ConversationRepositoryImpl";
import { BookingRepository } from "../../domain/interfaces/BookingRepository";
import { BookingRepositoryImpl } from "../odm/repositories/BookingRepositoryImpl";
import { MessageRepository } from "../../domain/interfaces/MessageRepository";
import { MessageRepositoryImpl } from "../odm/repositories/MessageRepositoryImpl";

// Redis Repository
import { RedisRepository } from "../../domain/interfaces/RedisRepository";
import { RedisRepositoryImpl } from "../redis/RedisRepositoryImpl";

import { UserUseCase } from "../../domain/interfaces/UserUseCase";
import { UserUseCaseImpl } from "../../application/use-cases/UserUseCaseImpl";
import { VendorUseCase } from "../../application/use-cases/VendorUseCase";
import { AuthUseCase } from "../../domain/interfaces/AuthUseCase";
import { AuthUseCaseImpl } from "../../application/use-cases/AuthUseCaseImpl";
import { TypeUseCase } from "../../domain/interfaces/TypeUseCase";
import { TypeUseCaseImpl } from "../../application/use-cases/TypeUseCaseImpl";
import { NotificationUseCase } from "../../domain/interfaces/NotificationUseCase";
import { NotificationUseCaseImpl } from "../../application/use-cases/NotificatioUseCaseImpl";
import { PostUseCase } from "../../domain/interfaces/PostUseCase";
import { PostUseCaseImpl } from "../../application/use-cases/PostUseCaseImpl";
import { ConversationUseCase } from "../../domain/interfaces/ConversationUseCase";
import { ConversationUseCaseImpl } from "../../application/use-cases/ConversationUseCaseImpl";
import { MessageUseCase } from "../../domain/interfaces/MessageUseCase";
import { MessageUseCaseImpl } from "../../application/use-cases/MessageUseCaseImpl";
import { BookingUseCase } from "../../domain/interfaces/BookingUseCase";
import { BookingUseCaseImpl } from "../../application/use-cases/BookingUseCaseImpl";

import { EmailService } from "../../domain/interfaces/EmailService";
import { EmailServiceImpl } from "../../application/services/EmailServiceImpl";
import { PasswordService } from "../../domain/interfaces/PasswordService";
import { PasswordServiceImpl } from "../../application/services/PasswordServiceImpl";
import { UploadService } from "../../domain/interfaces/UploadService";
import { UploadServiceImpl } from "../../application/services/UploadServiceImpl";
import { NotificationService } from "../../domain/interfaces/NotificationService";
import { NotificationServiceImpl } from "../../application/services/NotificationServiceImpl";
import { TokenService } from "../../domain/interfaces/TokenService";
import { TokenServiceImpl } from "../../application/services/TokenServiceImpl";

const container = new Container();

// Bind repositories
container.bind<AdminRepository>(TYPES.AdminRepository).to(AdminRepositoryImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<VendorRepository>(TYPES.VendorRepository).to(VendorRepositoryImpl);
container.bind<NotificationRepository>(TYPES.NotificationRepository).to(NotificationRepositoryImpl);
container.bind<TypeRepository>(TYPES.TypeRepository).to(TypeRepositoryImpl);
container.bind<PostRepository>(TYPES.PostRepository).to(PostRepositoryImpl);
container.bind<ConversationRepository>(TYPES.ConversationRepository).to(ConversationRepositoryImpl);
container.bind<BookingRepository>(TYPES.BookingRepository).to(BookingRepositoryImpl);
container.bind<MessageRepository>(TYPES.MessageRepository).to(MessageRepositoryImpl);

// Bind redis repository
container.bind<RedisRepository>(TYPES.RedisRepository).to(RedisRepositoryImpl);

// Bind use cases
container.bind<UserUseCase>(TYPES.UserUseCase).to(UserUseCaseImpl);
container.bind<VendorUseCase>(TYPES.VendorUseCase).to(VendorUseCase);
container.bind<AuthUseCase>(TYPES.AuthUseCase).to(AuthUseCaseImpl);
container.bind<TypeUseCase>(TYPES.TypeUseCase).to(TypeUseCaseImpl);
container.bind<NotificationUseCase>(TYPES.NotificationUseCase).to(NotificationUseCaseImpl);
container.bind<PostUseCase>(TYPES.PostUseCase).to(PostUseCaseImpl);
container.bind<ConversationUseCase>(TYPES.ConversationUseCase).to(ConversationUseCaseImpl);
container.bind<MessageUseCase>(TYPES.MessageUseCase).to(MessageUseCaseImpl);
container.bind<BookingUseCase>(TYPES.BookingUseCase).to(BookingUseCaseImpl);

// Bind services
container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl);
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordServiceImpl);
container.bind<UploadService>(TYPES.UploadService).to(UploadServiceImpl);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationServiceImpl);
container.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl);

// Bind controllers
container.bind<UserController>(TYPES.UserController).to(UserControllerImpl);
container.bind<VendorController>(TYPES.VendorController).to(VendorControllerImpl);
container.bind<AuthController>(TYPES.AuthController).to(AuthControllerImpl);
container.bind<VendorTypeController>(TYPES.TypeController).to(VendorTypeControllerImpl);
container.bind<PostController>(TYPES.PostController).to(PostControllerImpl);
container.bind<ConversationController>(TYPES.ConversationController).to(ConversationControllerImpl);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationControllerImpl);
container.bind<BookingController>(TYPES.BookingController).to(BookingControllerImpl);
container.bind<MessageController>(TYPES.MessageController).to(MessageControllerImpl);

export { container };
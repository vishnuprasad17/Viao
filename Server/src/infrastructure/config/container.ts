import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";

import { AdminController } from "../../domain/interfaces/adapter interfaces/AdminController";
import { AdminControllerImpl } from "../../adapters/controllers/AdminControllerImpl";
import { UserController } from "../../domain/interfaces/adapter interfaces/UserController";
import { UserControllerImpl } from "../../adapters/controllers/UserControllerImpl";
import { VendorController } from "../../domain/interfaces/adapter interfaces/VendorController";
import { VendorControllerImpl } from "../../adapters/controllers/VendorControllerImpl";
import { AuthController } from "../../domain/interfaces/adapter interfaces/AuthController";
import { AuthControllerImpl } from "../../adapters/controllers/AuthControllerImpl";
import { VendorTypeController } from "../../domain/interfaces/adapter interfaces/VendorTypeController";
import { VendorTypeControllerImpl } from "../../adapters/controllers/VendorTypeControllerImpl";
import { PostController } from "../../domain/interfaces/adapter interfaces/PostController";
import { PostControllerImpl } from "../../adapters/controllers/PostControllerImpl";
import { ConversationController } from "../../domain/interfaces/adapter interfaces/ConversationController";
import { ConversationControllerImpl } from "../../adapters/controllers/ConversationControllerImpl";
import { NotificationController } from "../../domain/interfaces/adapter interfaces/NotificationController";
import { NotificationControllerImpl } from "../../adapters/controllers/NotificationControllerImpl";
import { BookingController } from "../../domain/interfaces/adapter interfaces/BookingController";
import { BookingControllerImpl } from "../../adapters/controllers/BookingControllerImpl";
import { MessageController } from "../../domain/interfaces/adapter interfaces/MessageController";
import { MessageControllerImpl } from "../../adapters/controllers/MessageController";
import { ReviewController } from "../../domain/interfaces/adapter interfaces/ReviewController";
import { ReviewControllerImpl } from "../../adapters/controllers/ReviewControllerImpl";
import { PaymentController } from "../../domain/interfaces/adapter interfaces/PaymentController";
import { PaymentControllerImpl } from "../../adapters/controllers/PaymentControllerImpl";
import { ServiceController } from "../../domain/interfaces/adapter interfaces/ServiceController";
import { ServiceControllerImpl } from "../../adapters/controllers/ServiceControllerImpl";

import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { AdminRepositoryImpl } from "../odm/repositories/AdminRepositoryImpl";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { UserRepositoryImpl } from "../odm/repositories/UserRepositoryImpl";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { VendorRepositoryImpl } from "../odm/repositories/VendorRepositoryImpl";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { NotificationRepositoryImpl } from"../odm/repositories/NotificationRepositoryImpl";
import { TypeRepository } from "../../domain/interfaces/infrastructure interfaces/TypeRepository";
import { TypeRepositoryImpl } from"../odm/repositories/TypeRepositoryImpl";
import { PostRepository } from "../../domain/interfaces/infrastructure interfaces/PostRepository";
import { PostRepositoryImpl } from"../odm/repositories/PostRepositoryImpl";
import { ConversationRepository } from "../../domain/interfaces/infrastructure interfaces/ConversationRepository";
import { ConversationRepositoryImpl } from"../odm/repositories/ConversationRepositoryImpl";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { BookingRepositoryImpl } from "../odm/repositories/BookingRepositoryImpl";
import { MessageRepository } from "../../domain/interfaces/infrastructure interfaces/MessageRepository";
import { MessageRepositoryImpl } from "../odm/repositories/MessageRepositoryImpl";
import { ReviewRepository } from "../../domain/interfaces/infrastructure interfaces/ReviewRepository";
import { ReviewRepositoryImpl } from "../odm/repositories/ReviewRepositoryImpl";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import { PaymentRepositoryImpl } from "../odm/repositories/PaymentRepositoryImpl";
import { ServiceRepository } from "../../domain/interfaces/infrastructure interfaces/ServiceRepository";
import { ServiceRepositoryImpl } from "../odm/repositories/ServiceRepositoryImpl";

// Redis Repository
import { RedisRepository } from "../../domain/interfaces/infrastructure interfaces/RedisRepository";
import { RedisRepositoryImpl } from "../redis/RedisRepositoryImpl";

import { AdminUseCase } from "../../domain/interfaces/application interfaces/AdminUseCase";
import { AdminUseCaseImpl } from "../../application/use-cases/AdminUseCaseImpl";
import { UserUseCase } from "../../domain/interfaces/application interfaces/UserUseCase";
import { UserUseCaseImpl } from "../../application/use-cases/UserUseCaseImpl";
import { VendorUseCase } from "../../domain/interfaces/application interfaces/VendorUseCase";
import { VendorUseCaseImpl } from "../../application/use-cases/VendorUseCaseImpl";
import { AuthUseCase } from "../../domain/interfaces/application interfaces/AuthUseCase";
import { AuthUseCaseImpl } from "../../application/use-cases/AuthUseCaseImpl";
import { TypeUseCase } from "../../domain/interfaces/application interfaces/TypeUseCase";
import { TypeUseCaseImpl } from "../../application/use-cases/TypeUseCaseImpl";
import { NotificationUseCase } from "../../domain/interfaces/application interfaces/NotificationUseCase";
import { NotificationUseCaseImpl } from "../../application/use-cases/NotificatioUseCaseImpl";
import { PostUseCase } from "../../domain/interfaces/application interfaces/PostUseCase";
import { PostUseCaseImpl } from "../../application/use-cases/PostUseCaseImpl";
import { ConversationUseCase } from "../../domain/interfaces/application interfaces/ConversationUseCase";
import { ConversationUseCaseImpl } from "../../application/use-cases/ConversationUseCaseImpl";
import { MessageUseCase } from "../../domain/interfaces/application interfaces/MessageUseCase";
import { MessageUseCaseImpl } from "../../application/use-cases/MessageUseCaseImpl";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import { BookingUseCaseImpl } from "../../application/use-cases/BookingUseCaseImpl";
import { ReviewUseCase } from "../../domain/interfaces/application interfaces/ReviewUseCase";
import { ReviewUseCaseImpl } from "../../application/use-cases/ReviewUseCaseImpl";
import { PaymentUseCase } from "../../domain/interfaces/application interfaces/PaymentUseCase";
import { PaymentUseCaseImpl } from "../../application/use-cases/PaymentUseCaseImpl";
import { ServiceUseCase } from "../../domain/interfaces/application interfaces/ServiceUseCase";
import { ServiceUseCaseImpl } from "../../application/use-cases/ServiceUseCaseImpl";

import { EmailService } from "../../domain/interfaces/application interfaces/EmailService";
import { EmailServiceImpl } from "../../application/services/EmailServiceImpl";
import { PasswordService } from "../../domain/interfaces/application interfaces/PasswordService";
import { PasswordServiceImpl } from "../../application/services/PasswordServiceImpl";
import { UploadService } from "../../domain/interfaces/application interfaces/UploadService";
import { UploadServiceImpl } from "../../application/services/UploadServiceImpl";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationServiceImpl } from "../../application/services/NotificationServiceImpl";
import { TokenService } from "../../domain/interfaces/adapter interfaces/TokenService";
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
container.bind<ReviewRepository>(TYPES.ReviewRepository).to(ReviewRepositoryImpl);
container.bind<PaymentRepository>(TYPES.PaymentRepository).to(PaymentRepositoryImpl);
container.bind<ServiceRepository>(TYPES.ServiceRepository).to(ServiceRepositoryImpl);

// Bind redis repository
container.bind<RedisRepository>(TYPES.RedisRepository).to(RedisRepositoryImpl);

// Bind use cases
container.bind<AdminUseCase>(TYPES.AdminUseCase).to(AdminUseCaseImpl);
container.bind<UserUseCase>(TYPES.UserUseCase).to(UserUseCaseImpl);
container.bind<VendorUseCase>(TYPES.VendorUseCase).to(VendorUseCaseImpl);
container.bind<AuthUseCase>(TYPES.AuthUseCase).to(AuthUseCaseImpl);
container.bind<TypeUseCase>(TYPES.TypeUseCase).to(TypeUseCaseImpl);
container.bind<NotificationUseCase>(TYPES.NotificationUseCase).to(NotificationUseCaseImpl);
container.bind<PostUseCase>(TYPES.PostUseCase).to(PostUseCaseImpl);
container.bind<ConversationUseCase>(TYPES.ConversationUseCase).to(ConversationUseCaseImpl);
container.bind<MessageUseCase>(TYPES.MessageUseCase).to(MessageUseCaseImpl);
container.bind<BookingUseCase>(TYPES.BookingUseCase).to(BookingUseCaseImpl);
container.bind<ReviewUseCase>(TYPES.ReviewUseCase).to(ReviewUseCaseImpl);
container.bind<PaymentUseCase>(TYPES.PaymentUseCase).to(PaymentUseCaseImpl);
container.bind<ServiceUseCase>(TYPES.ServiceUseCase).to(ServiceUseCaseImpl);

// Bind services
container.bind<EmailService>(TYPES.EmailService).to(EmailServiceImpl);
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordServiceImpl);
container.bind<UploadService>(TYPES.UploadService).to(UploadServiceImpl);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationServiceImpl);
container.bind<TokenService>(TYPES.TokenService).to(TokenServiceImpl);

// Bind controllers
container.bind<AdminController>(TYPES.AdminController).to(AdminControllerImpl);
container.bind<UserController>(TYPES.UserController).to(UserControllerImpl);
container.bind<VendorController>(TYPES.VendorController).to(VendorControllerImpl);
container.bind<AuthController>(TYPES.AuthController).to(AuthControllerImpl);
container.bind<VendorTypeController>(TYPES.TypeController).to(VendorTypeControllerImpl);
container.bind<PostController>(TYPES.PostController).to(PostControllerImpl);
container.bind<ConversationController>(TYPES.ConversationController).to(ConversationControllerImpl);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationControllerImpl);
container.bind<BookingController>(TYPES.BookingController).to(BookingControllerImpl);
container.bind<MessageController>(TYPES.MessageController).to(MessageControllerImpl);
container.bind<ReviewController>(TYPES.ReviewController).to(ReviewControllerImpl);
container.bind<PaymentController>(TYPES.PaymentController).to(PaymentControllerImpl);
container.bind<ServiceController>(TYPES.ServiceController).to(ServiceControllerImpl);

export { container };

const TYPES = {
    //Auth
    AuthUseCase: Symbol.for("AuthUseCase"),
    AuthController: Symbol.for("AuthController"),
    
    //Admin
    AdminRepository: Symbol.for("AdminRepository"),
    AdminUseCase: Symbol.for("AdminUseCase"),
    AdminController: Symbol.for("AdminController"),
    //User
    UserRepository: Symbol.for("UserRepository"),
    UserUseCase: Symbol.for("UserUseCase"),
    UserController: Symbol.for("UserController"),
    //Vendor
    VendorRepository: Symbol.for("VendorRepository"),
    VendorUseCase: Symbol.for("VendorUseCase"),
    VendorController: Symbol.for("VendorController"),
    //Vendor Type
    TypeRepository: Symbol.for("TypeRepository"),
    TypeUseCase: Symbol.for("TypeUseCase"),
    TypeController: Symbol.for("TypeController"),
    //VendorService Type
    ServiceRepository: Symbol.for("ServiceRepository"),
    ServiceUseCase: Symbol.for("ServiceUseCase"),
    ServiceController: Symbol.for("ServiceController"),
    //Notifications
    NotificationRepository: Symbol.for("NotificationRepository"),
    NotificationUseCase: Symbol.for("NotificationUseCase"),
    NotificationController: Symbol.for("NotificationController"),
    //Post
    PostRepository: Symbol.for("PostRepository"),
    PostUseCase: Symbol.for("PostUseCase"),
    PostController: Symbol.for("PostController"),
    //Conversation
    ConversationRepository: Symbol.for("ConversationRepository"),
    ConversationUseCase: Symbol.for("ConversationUseCase"),
    ConversationController: Symbol.for("ConversationController"),
    //Booking
    BookingRepository: Symbol.for("BookingRepository"),
    BookingUseCase: Symbol.for("BookingUseCase"),
    BookingController: Symbol.for("BookingController"),
    //Message
    MessageRepository: Symbol.for("MessageRepository"),
    MessageUseCase: Symbol.for("MessageUseCase"),
    MessageController: Symbol.for("MessageController"),
    //Review
    ReviewRepository: Symbol.for("ReviewRepository"),
    ReviewUseCase: Symbol.for("ReviewUseCase"),
    ReviewController: Symbol.for("ReviewController"),
    //Payment
    PaymentRepository: Symbol.for("PaymentRepository"),
    PaymentUseCase: Symbol.for("PaymentUseCase"),
    PaymentController: Symbol.for("PaymentController"),
    //Services
    EmailService: Symbol.for("EmailService"),
    OtpService: Symbol.for("OtpService"),
    PasswordService: Symbol.for("PasswordService"),
    UploadService: Symbol.for("UploadService"),
    NotificationService: Symbol.for("NotificationService"),
    TokenService: Symbol.for("TokenService"),
    //Redis
    RedisRepository: Symbol.for("RedisRepository"),
  };
  
  export default TYPES;  
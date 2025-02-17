import { User } from "../entities/User";

export class UserDTO {
    id: string;
    email: string;
    name: string;
    phone: number;
    isActive: boolean;
    imageUrl: string;
    favourite: string[];
    wallet: number;
  
    constructor(user: User) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.phone = user.phone;
      this.isActive = user.isActive;
      this.imageUrl = user.imageUrl;
      this.favourite = user.favourite;
      this.wallet = user.wallet;
    }
  
    static fromDomain(user: User): UserDTO {
      return new UserDTO(user);
    }
  
    static fromDomainList(users: User[]): UserDTO[] {
      return users.map(user => new UserDTO(user));
    }
  }
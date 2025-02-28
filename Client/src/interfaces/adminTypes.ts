export interface AdminData{
    id:string;
    email:string;
    password:string;
    createdAt:Date;
    isAdmin:boolean;
    wallet:number;
    refreshToken:string;
}
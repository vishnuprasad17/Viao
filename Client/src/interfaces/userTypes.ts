export interface UserData{
    _id:string;
    email : string;
    password : string;
    name : string;
    phone : number;
    isActive:boolean;
    imageUrl:string;
    favourite:string[];
    wallet:number;
    refreshToken:string;
}
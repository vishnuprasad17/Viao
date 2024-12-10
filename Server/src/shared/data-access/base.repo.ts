import mongoose from "mongoose";

export class BaseRepository<T extends mongoose.Document>{
    private model:mongoose.Model<T>;

    constructor(model:mongoose.Model<T>){
        this.model=model;
    }

    async getAll():Promise<T[]>{
        return await this.model.find();
    }

    async getById(id:string):Promise<T|null>{
        return await this.model.findById(id);
    }

    async create(data:Partial<T>):Promise<T>{
        const newItem=new this.model(data);
        return await newItem.save();
    }

    async findOne(condition: Record<string, unknown>): Promise<T | null> {
        return await this.model.findOne(condition);
    }
    
    async findByEmail(email: string): Promise<T | null> {
        return await this.model.findOne({ email });
    }
}
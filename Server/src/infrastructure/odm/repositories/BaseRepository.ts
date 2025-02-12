import mongoose from "mongoose";

export abstract class BaseRepository<TDocument extends mongoose.Document, TDomain>{
    private model:mongoose.Model<TDocument>;

    constructor(model:mongoose.Model<TDocument>){
        this.model=model;
    }

    // Abstract mapping methods to be implemented by subclasses
    protected abstract toDomain(document: TDocument): TDomain;
    protected abstract toDatabase(domain: TDomain, password?: string): Partial<TDocument>;

    async getAll():Promise<TDomain[]>{
        const documents = await this.model.find();
        return documents.map(this.toDomain);
    }

    async getById(id:string):Promise<TDomain|null>{
        const document = await this.model.findById(id);
        return document? this.toDomain(document) : null;
    }

    async create(domain: TDomain, password?: string):Promise<TDomain>{
        const newDocument= password ? new this.model(this.toDatabase(domain, password))
                                    : new this.model(this.toDatabase(domain));
        const savedDocument = await newDocument.save();
        return this.toDomain(savedDocument);
    }

    async update(id:string, domain: Partial<TDomain>):Promise<TDomain|null>{
        const updatedDocument = await this.model.findByIdAndUpdate(id,
            this.toDatabase(domain as TDomain),
            { new: true }
        );
        return updatedDocument? this.toDomain(updatedDocument) : null;
    }


    async delete(id:string):Promise<TDomain|null>{
        const deletedDocument = await this.model.findByIdAndDelete(id);
        return deletedDocument? this.toDomain(deletedDocument) : null;
    }

    async countDocuments(condition?:Record<string,unknown>):Promise<number>{
        return await this.model.countDocuments(condition||{})
    }

    async findOne(condition: Record<string, unknown>): Promise<TDomain | null> {
        const document = await this.model.findOne(condition);
        return document? this.toDomain(document) : null;
    }

    async block(id: string, status: boolean): Promise<TDomain | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(id,
            { isActive: status }, 
            { new: true }
        );
        return updatedDocument? this.toDomain(updatedDocument) : null;
    }
    
    async findByEmail(email: string): Promise<TDomain | null> {
        const document = await this.model.findOne({ email });
        return document? this.toDomain(document) : null;
    }

    async findByPhone(phone:number): Promise<TDomain | null> {
        const document = await this.model.findOne({ phone });
        return document? this.toDomain(document) : null;
    }

    async findByCondition(condition: Record<string, unknown>): Promise<TDomain[]> {
        const document = await this.model.find(condition);
        return document.map(this.toDomain);
    }
}
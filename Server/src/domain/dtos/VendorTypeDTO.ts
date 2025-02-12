import { VendorType } from "../entities/VendorType";

export class VendorTypeDTO {
    id: string;
    type: string;
    status: boolean;
    imageUrl:string;
  
    constructor(vendortype: VendorType) {
      this.id = vendortype.id;
      this.type = vendortype.type;
      this.status = vendortype.status;
      this.imageUrl = vendortype.imageUrl;
    }
  
    static fromDomain(vendortype: VendorType): VendorTypeDTO {
      return new VendorTypeDTO(vendortype);
    }
  
    static fromDomainList(vendortypes: VendorType[]): VendorTypeDTO[] {
      return vendortypes.map(vendortype => new VendorTypeDTO(vendortype));
    }
  }  
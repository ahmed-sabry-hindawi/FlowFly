import { FormElementInfo } from "./FormElementInfo.model";

export class RequestElementInfo
{


id!:number;

requestId!:number;

formElementId!:number;

value!:any;

createdOn!:Date;

createdBy!: string;

formElement!:FormElementInfo;

fileContent!:any;

fileExtension!:string;


}
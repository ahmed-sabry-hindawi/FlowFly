import { ServiceInfo } from "./ServiceInfo.model";

export class SubmitStageInfo
{
    id!:number;

    name!:string;

    serviceId!:number;

    service!:ServiceInfo;

    fromDate!:string;

    toDate!:string;

    isActive!:boolean;

    createdOn!:Date;

    createdBy!: string;

    updatedOn!:Date;

    updatedBy!: string;
}
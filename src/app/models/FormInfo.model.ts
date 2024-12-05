import { ApprovalsPhaseInfo } from "./ApprovalsPhaseInfo.model";
import { FormElementInfo } from "./FormElementInfo.model";

export class FormInfo {

    id!: number;

    name!: string;

   // description!: string;

    serviceID!: number;
    

    formElements!:FormElementInfo[];

    approvalsPhases!:ApprovalsPhaseInfo[];

    goLive!:boolean;

    isActive!:boolean;

    createdOn!:Date;

    createdBy!: string;

}
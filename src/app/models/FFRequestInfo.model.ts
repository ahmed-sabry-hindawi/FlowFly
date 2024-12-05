import { ApprovalsPhaseInfo } from "./ApprovalsPhaseInfo.model";
import { FormInfo } from "./FormInfo.model";
import { RequestElementInfo } from "./RequestElementInfo.model";
import { RequestStatusInfo } from "./RequestStatusInfo.model";
import { ServiceInfo } from "./ServiceInfo.model";
import { TaskInfo } from "./TaskInfo.model";
import { UserInfo } from "./UserInfo.model";

export class FFRequestInfo {


    requestId!: number;

    userId!: number;

    serviceId!: number;

    formId!:number;

    requestStatusId!: number;

    user!:UserInfo;

    service!:ServiceInfo;

    form!:FormInfo;

    requestElements!:RequestElementInfo[];

    currentPhase!:ApprovalsPhaseInfo;

    requestStatus!:RequestStatusInfo;

    assignedTasks!:TaskInfo[];

    currentPhaseId!: number;

    currentTaskOwnersNames!:string[];

    createdOn!:Date;

    createdBy!: string;

    updatedOn!:Date;

    updatedBy!: string;


}
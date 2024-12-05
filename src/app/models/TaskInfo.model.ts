import { ApprovalsPhaseInfo } from "./ApprovalsPhaseInfo.model";
import { FFRequestInfo } from "./FFRequestInfo.model";


export class TaskInfo {

    taskId!:string; 

    phaseId!:number;

    requestId!: number;

    decisionId!:number;

    isDone!: boolean;

    notes!:string;

    createdOn!:Date;

    executedOn!:Date;

    executedBy!: number;

    executedByName!: string;

    timeOutOn!:Date;
    
    openToActionFrom!:Date;

    openToActionTo!:Date;

    request!:FFRequestInfo;

    phase!:ApprovalsPhaseInfo;

}
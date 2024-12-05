import { PhaseDecisionInfo } from "./PhaseDecisionInfo.model";

export class ApprovalsPhaseInfo {


    id!: number;

    name!: string;

    approvalTypeID!: number;

    formID!: number;

    phaseOrder!: number;

    groupID!: number;

    departmentID!: number;

    endPointId!: number;

    PhaseTimingTypeId!:number;

    styleClass!:string;

    phaseDecisions!:PhaseDecisionInfo[];  


}
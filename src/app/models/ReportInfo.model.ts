import { FormInfo } from "./FormInfo.model";
import { ReportRequestInfo } from "./ReportRequestInfo.model";

export class ReportInfo
{

    requests!:ReportRequestInfo[];

    columnsCount!:number;

    columnsTitles!:string[];

    serviceForm!:FormInfo;

    sums: Record<number, GLfloat>=[];

    averages: Record<number, GLfloat>=[];

    reportSummary!:SummaryItem[];
}


export class SummaryItem {
   
    ElementID!:string;

    ElementTypeID!:number;

    ElementName!:string;

    ElementSum!:number;

    ElementAverage!:GLfloat;
}
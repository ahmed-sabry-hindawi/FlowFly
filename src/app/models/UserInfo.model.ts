import { DepartmentInfo } from "./DepartmentInfo.model";
import { NationalityInfo } from "./NationalityInfo.model";


export class UserInfo {
    userId!: number;
    userName!: string;
    email!:string;
    NationalityId!: number;
    nationality!: NationalityInfo;
    department!:DepartmentInfo;
    fullName!: string;
    createdBy!: string;
    createdOn!: Date;
    isActive!: boolean;
    gender!: boolean;
    dob!: string;
    subDepartmentId!: number;
    departmentId!: number;
    jobTitle!:string;
    personalImage!:string;


    newFileContent!:any;
    newFileExtension!:string;


 

}
import { ApprovalTypeInfo } from "./ApprovalTypeInfo.model";
import { DepartmentTypeInfo } from "./DepartmentTypeInfo.model";
import { UserInfo } from "./UserInfo.model";

export class DepartmentInfo {
    departmentId!: number;

    departmentTypeId!: number;

    departmentName!: string;

    parentDepartmentId!: number;

    managerUserId!: number;

    departmentType!: DepartmentTypeInfo;

    managerUser!: UserInfo;

    users!: UserInfo[];


}
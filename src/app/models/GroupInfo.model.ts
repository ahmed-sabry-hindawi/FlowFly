import { UserInfo } from "./UserInfo.model";

export class GroupInfo {
    id: number;
    name: string;
    description: string;
    arName: string;
    createdBy: string;
    createdOn!: Date;
    isActive: boolean;
    updatedBy: string;
    updatedOn!: Date;
   
    users: UserInfo[];

    // constructor(id: number, name: string, description: string, arName: string, createdBy: string, createdOn: Date, isActive: boolean, users: UserInfo[]) {
    //     this.id = id;
    //     this.name = name;
    //     this.description = description;
    //     this.createdBy = createdBy;
    //     this.createdOn = createdOn;
    //     this.isActive = isActive;
    //     this.arName = arName;
    //     this.users = users;
    // }


}
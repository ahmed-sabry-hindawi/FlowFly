export class SearchUsersDTO {
    userID!: number;
    name!: string;
    subDepartmentID!: number;
    departmentID!: number;
    pageIndex: number;
    pageSize: number;


    constructor()
    {
        this.pageIndex=1;
        this.pageSize=10;
        this.userID=-1;
        this.departmentID=-1;
        this.subDepartmentID=-1;
        this.name='';
    }

}
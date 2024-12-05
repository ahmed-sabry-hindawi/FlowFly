export class TreeDepartmentInfo
{

    DepartmentID!:number;

    DepartmentName!:string;
   
   
    DepartmentTypeID!:number;

    Children: TreeDepartmentInfo[]=[];
}
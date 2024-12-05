export class ServiceInfo {
     id!: number ;
     name!: string ;
     categoryID!: number;
     formID!: number;
     description!: string;
     isActive!:boolean;
     forGender!:boolean;
     forCitizens!:boolean;
     forGroup!:number;
     forManagers!:boolean;  
     stagesDependent!:boolean; 
     requestsCountTypeId!:number;
     showingRequestHistoryTypeId!:number;
     createdOn!:Date;
}
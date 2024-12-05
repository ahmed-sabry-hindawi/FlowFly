import { ServiceInfo } from "./ServiceInfo.model";

export class ServiceCategoryInfo {
    id: number;
    name: string;
    createdBy!:string;
    icon!:string;
    services: ServiceInfo[];

    constructor(id: number, name: string, services: ServiceInfo[]) {
        this.id = id;
        this.name = name;
        this.services = services;
    }
}
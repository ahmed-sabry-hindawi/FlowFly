import { ItemInfo } from "./ItemInfo.model";


export class DataSourceInfo {
    id!: number;
    name!: string;
    arName!: string;
    createdBy!: string;
    createdOn!: Date;
    isActive!: boolean;
    updatedBy!: string;
    updatedOn!: Date;
    dataSourceItems!: ItemInfo[];

}
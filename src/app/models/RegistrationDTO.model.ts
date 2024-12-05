import { UserInfo } from "./UserInfo.model";

export class RegistrationDTO
{
    constructor()
    {
        this.profile=new UserInfo();
    }

    userName!:string;

    email!:string;


    password!:string;

    profile!:UserInfo;
}
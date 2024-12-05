export class User {
    constructor(
        public fullName:string='غير مسجل',
        public gender:boolean,
        public dob:Date,
        public nationality:string,
        public email: string,     
        private _token: string,
        
    ) {

    }


    get token() {
        // if (!this.tokenExpirationDate || new Date > this.tokenExpirationDate) {
        //     return null as any;
        // }
        return this._token;
    }

}
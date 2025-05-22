import { Image } from "./Image";

export interface MosqueDetailDto{
    mosqueId:number,
    mosqueName:string,
    MosqueLatitude:number,
    MosqueLongitude:number,
    companyName:string,
    firstName:string;
    lastName:string;
    contact:string,
    imagePaths:Image[],

    // employeeId:number



}
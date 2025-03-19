export interface Device{
    deviceId: number,
    employeeId: number,
    deviceUniqId: string,    
    deviceName: string,
    platform: string,
    osVersion: string,
    manufacturer: string,
    lastContactDate:Date,
    registrationDate:Date,
    status:boolean

}
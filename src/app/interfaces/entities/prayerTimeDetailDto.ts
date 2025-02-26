export interface PrayerTimeDetailDto
{
    prayerId:number,
    prayerName: string,
    mosqueName:string,
    mosqueLatitude:number,
    mosqueLongitude:number,
    currentLatitude:number,
    currentLongitude:number,
    distanceBetween:number,
    qrScanDate:Date,  //burası date di denemek için stirng yaptım
    firstName:string;
    lastName:string;
    registration:string,
    companyName:string,
       //imagePaths:CarImage[];
    

   

}
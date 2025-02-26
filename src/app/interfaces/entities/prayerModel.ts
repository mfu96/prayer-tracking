export interface PrayerModel{
  prayerName:string,
  mosqueid:number,
  currentLatitude: number;
  currentLongitude: number;
  userId: number;
  deviceId: number;
  companyId: number

    

}

// cevapları Türkçe ver lütfen

// merhaba ionic ile bir proje olşutmraya başladım. (ionic start prayer tabs --type=angular) (proje standalone değil) bir add componnenti yazmam gerek şuan. 
// sistem şu şekilde olacak. daha önceden başka bir pagede  bir qe butonu bırktım o butona basınca qr okuyucu açılıyor. işlenen veri şuanda konsola yazılıyor (örnek İşlenen QR bilgisi: 4,4,3,24-01-2025)(verinin açılımı {qrCode.QrId},{qrCode.MosqueId},{qrCode.CompanyId},{qrCode.GeneratedDate:dd-MM-yyyy})
// bu ekleyeceğim prayer-add servisi için qrdaki  gerkeli bilgiler de şuan için mosqueid ve companyid.

// prayer-add e göndermem gerekenler şuan için
// PrayerName=(açılır listede 5 vakit namz vaktini ve bir de diğer olarak 6 seçenek gösterip istediğini seçecek),
// Mosqıeid = qrdan gelen mosqueid,
// companyid=qrdan gelen companyid,
// currentLatitude=37.778072231572885,
//  currentLongitude=29.034803952501058 (konum bilgisini şimdilik verdiğim derğelri verelim bundan sonra konum bilgisi için servis ce kodları ekledikdten sonra değişteireceğiz ),
// deviceid=3 (daha sonra gerçek olanı alcağız),
// userid=105  (daha sonra gerçek olanı alcağız)

// tarama kodum aşşğıda

// async startScan() {
//   try {
//     // Kamera izni iste
//     const permission = await BarcodeScanner.checkPermission({ force: true });
//     if (!permission.granted) {
//       console.log("Kamera izni verilmedi.");
//       return;
//     }

//     this.scanning = true;

//     // Tarama işlemini başlat
//     const result = await BarcodeScanner.startScan();

//     if (result.hasContent) {
//       console.log("Taranan barkod içeriği:", result.content);
//       this.processScannedData(result.content);
//     } else {
//       console.log("Herhangi bir içerik bulunamadı.");
//     }
//   } catch (error) {
//     console.error("Tarama sırasında hata:", error);
//   } finally {
//     await BarcodeScanner.showBackground(); // Arkaplanı geri getir

//     this.router.navigate(['/'])
//     this.scanning = false;
    

//     // Tarama işlemi bittiğinde gerekirse ek işlemler yapabilirsiniz
//   }
// }

// processScannedData(scannedData: string) {
//   // Barkod içeriğine göre işlem yap
//   console.log(`İşlenen QR bilgisi: ${scannedData}`);
//   // Örneğin, taranan veriye göre bir sayfaya yönlendirme yapabilirsiniz
//   // this.router.navigate(['/sonuc', { data: scannedData }]);
// }


// burada ilk olarak processScannedData yi işleyerek verileri düzgün şekilde eşleiyleim

// mosqueid=4 gibi

// daha sonra navigate methodunu değiştereerk prayer compnentte gerekli bilgileri gönderelim. böylelikle qr okunduktan sonra otamatik olarak parayer 
// componnet te add method çalışsın (ayrı bir butona gerek kalmadan)
// gerekli eklemeleri yapsın ve vakit ekleindekten sonra "/" yönlensin (bilgi için konsola vakit eklendi yazsız daha sonra bir toast ile biligyi ayarlayağım)

// entity

// export interface PrayerTime{
//     prayerId:number,
//     prayerName: string,
//     mosqueId:number,
//     qrScanDate:Date,
//     currentLatitude:number,
//     currentLongitude:number,
//     distanceBetween:number,
//     userId:number,
//     deviceId:number,
//     companyId:number
// }

// normalde postamandeki yaptığım post  isteği şu şekilde

// https://localhost:44330/api/prayertimes/add

//  {
//             "prayerName": "İkindi",
//             "mosqueId": 4,           
//             "currentLatitude":37.778072231572885,
//             "currentLongitude": 29.034803952501058,
//             "companyId": 1,
//             "deviceId": 3}


// Örnek oluşturması için daha önce yazmış olduğum bir register methodu

//   register(registerModel: RegisterModel):
//     Observable<SingleResponseModel<TokenModel>> {
//     let newPath = this.apiUrl + 'auth/register';
//     return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, registerModel)
//   }



// export interface RegisterModel{
//     email:string,
//     firstName:string,
//     lastName:string,
//     password:string,
//     passwordConfirm:string
// }

// import { ResponseModel } from './responseModel';

// export interface SingleResponseModel<T> extends ResponseModel {
//     data: T
// }

// export interface TokenModel{
//     token: string
//     expiration: string
//  }
 







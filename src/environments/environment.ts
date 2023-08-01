// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://192.168.2.173',
  apiUrl: 'http://localhost',
  fileUrl: 'http://192.168.25.24:5050/Resources',
  secretKey: '00000000-0000-0000-0000-000000000000',
  infoApp: {
    version: '1.20221215.1',
    name: 'Esuhai.HRM'
  },
  soNgayDieuChinhTimesheet: 7,
  soNgayXetDuyetCap1: 7,
  soNgayXetDuyetCap2: 11,
  JWT_TOKEN : 'ttstoken',
  LOGIN_INFO : 'ttsuser'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

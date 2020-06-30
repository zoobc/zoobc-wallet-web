// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mnemonicLanguage: 'english',
  mnemonicNumWords: 24,
  fee: 0.01,
  etherscan: 'https://goerli.etherscan.io/',
  tokenAddress: '0xD76983d4C7F232ABa485De98C75bdd076546B44A',
  gasPrice: 3,
  gasLimit: 100000,
  chainId: 5,
  infuraProvider: 'wss://goerli.infura.io/ws/v3/02b8b87e84ed4293845926d6d2f473ff',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

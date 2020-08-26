import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { abi } from 'src/helpers/abi';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.WebsocketProvider(environment.infuraProvider));
import { saveAs } from 'file-saver';
import { eddsa as EdDSA } from 'elliptic';
import * as sha256 from 'sha256';
import { ZooKeyring, getZBCAdress } from 'zoobc-sdk';
import * as CryptoJS from 'crypto-js';
import SHA3 from 'sha3';

@Component({
  selector: 'app-genesis',
  templateUrl: './genesis.component.html',
})
export class GenesisComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    // const tokenAddress = environment.tokenAddress;
    // const abiItem = abi;
    // const contract = new web3.eth.Contract(abiItem, tokenAddress);
    // let json = [];
    // for (let i = 0; i < 200; i++) {
    //   try {
    //     const AccountAddress = await contract.methods.getAccountAddress(i).call();
    //     if (AccountAddress) {
    //       const NodeAccountAddress = await contract.methods.getNodePublicKey(i).call();
    //       json.push({ AccountAddress, NodeAccountAddress, Smithing: true });
    //     }
    //     // return resolve({ next: false, prev: false, seats: [] });
    //   } catch (err) {
    //     // return reject(err);
    //   }
    // }
    // const blob = new Blob([JSON.stringify(json)]);
    // saveAs(blob, 'genesis.json');

    const phrase = 'flush illness effort zero flag umbrella lens guide swim flower open hamster';
    const seedBuffer = Buffer.from(phrase);
    console.log(seedBuffer);

    const seedHash = this.hash(seedBuffer);
    console.log(seedHash.toString('hex'));

    const ec = new EdDSA('ed25519');
    const pairKey = ec.keyFromSecret(seedHash);
    const nodeAddress = getZBCAdress(pairKey.getPublic(), 'ZNK');
    console.log(nodeAddress);
    console.log(pairKey._privBytes);
  }

  hash(str: any, format: string = 'buffer') {
    console.log(str);

    const h = new SHA3(256);
    h.update(str);
    const b = h.digest();
    if (format == 'buffer') return b;
    return b.toString(format);
  }
}

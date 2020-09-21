import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { abi } from 'src/helpers/abi';
import Web3 from 'web3';
const provider = new Web3.providers.WebsocketProvider(environment.infuraProvider, {
  reconnect: {
    auto: true,
    delay: 1000,
    maxAttempts: 10,
  },
});
const web3 = new Web3(provider);
import { saveAs } from 'file-saver';
import SHA3 from 'sha3';

@Component({
  selector: 'app-genesis',
  templateUrl: './genesis.component.html',
})
export class GenesisComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    const tokenAddress = environment.tokenAddress;
    const abiItem = abi;
    const contract = new web3.eth.Contract(abiItem, tokenAddress);
    let json = [];
    for (let i = 0; i < 1100; i++) {
      try {
        const AccountAddress = await contract.methods.getAccountAddress(i).call();
        if (AccountAddress) {
          const NodeAccountAddress = await contract.methods.getNodePublicKey(i).call();
          json.push({ AccountAddress, NodeAccountAddress, Smithing: true });
        }
        // return resolve({ next: false, prev: false, seats: [] });
      } catch (err) {
        // return reject(err);
      }
    }
    const blob = new Blob([JSON.stringify(json)]);
    saveAs(blob, 'genesis.json');
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

import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { abi } from 'src/helpers/abi';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.WebsocketProvider(environment.infuraProvider));
import { saveAs } from 'file-saver';

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
    for (let i = 0; i < 100; i++) {
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
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { abi } from 'src/helpers/abi';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.WebsocketProvider(environment.infuraProvider));

export interface Seat {
  tokenId: number;
  zbcAddress?: string;
  ethAddress: string;
  nodePubKey?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  constructor() {}

  async search(search: string): Promise<Seat[]> {
    return new Promise((resolve, reject) => {
      if (search.match(/^0x[a-fA-F0-9]{40}$/))
        this.searchByAddress(search)
          .then(res => resolve(res))
          .catch(err => reject(err));
      else if (Number(search) > 0)
        this.searchByTokenId(Number(search))
          .then(res => resolve(res))
          .catch(err => reject(err));
    });
  }

  private async searchByAddress(address: string): Promise<Seat[]> {
    return new Promise(async (resolve, reject) => {
      const tokenAddress = environment.tokenAddress;
      const abiItem = abi;
      const contract = new web3.eth.Contract(abiItem, tokenAddress);

      let seats = [];
      let index = -1;
      let tokenId = null;
      do {
        index++;
        try {
          tokenId = await contract.methods.tokenOfOwnerByIndex(address, index).call();
          seats.push({ tokenId, ethAddress: address });
        } catch (err) {
          console.log(err);
          break;
        }
      } while (tokenId);

      seats.forEach((seat, i) => {
        try {
          contract.methods
            .getAccountAddress(seat.tokenId)
            .call()
            .then(zbcAddress => (seats[i].zbcAddress = zbcAddress));
        } catch (err) {
          console.log(err);
          return reject(err);
        }
      });
      return resolve(seats);
    });
  }

  private searchByTokenId(tokenId: number): Promise<Seat[]> {
    return new Promise(async (resolve, reject) => {
      const tokenAddress = environment.tokenAddress;
      const abiItem = abi;
      const contract = new web3.eth.Contract(abiItem, tokenAddress);

      try {
        const isExist = await contract.methods.exists(tokenId).call();
        if (isExist) {
          const zbcAddress = await contract.methods.getAccountAddress(tokenId).call();
          const ethAddress = await contract.methods.ownerOf(tokenId).call();

          return resolve([{ zbcAddress, ethAddress, tokenId }]);
        }
        return resolve([]);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async get(tokenId: number): Promise<Seat> {
    const tokenAddress = environment.tokenAddress;
    const abiItem = abi;
    const contract = new web3.eth.Contract(abiItem, tokenAddress);

    try {
      const isExist = await contract.methods.exists(tokenId).call();
      if (isExist) {
        const zbcAddress = await contract.methods.getAccountAddress(tokenId).call();
        const nodePubKey = await contract.methods.getNodePublicKey(tokenId).call();
        const message = await contract.methods.getGenesisMessage(tokenId).call();
        const ethAddress = await contract.methods.ownerOf(tokenId).call();

        return { zbcAddress, nodePubKey, message, ethAddress, tokenId };
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  update(seat: Seat): Promise<void> {
    return new Promise((resolve, reject) => {
      const ethereum = window['ethereum'];

      if (ethereum) {
        const tokenAddress = environment.tokenAddress;
        const abiItem = abi;

        let contract = new web3.eth.Contract(abiItem, tokenAddress);
        const data = contract.methods
          .setData(seat.tokenId, seat.zbcAddress, seat.nodePubKey, seat.message)
          .encodeABI();
        contract.options.from = ethereum.selectedAddress;

        const transactionParameters = {
          nonce: '0x00',
          gasPrice: web3.utils.toHex(web3.utils.toWei(environment.gasPrice.toString(), 'gwei')),
          gas: web3.utils.toHex(environment.gasLimit.toString()),
          to: tokenAddress,
          from: ethereum.selectedAddress,
          value: '0x00',
          data: data,
          chainId: environment.chainId,
        };

        ethereum.sendAsync(
          {
            method: 'eth_sendTransaction',
            params: [transactionParameters],
            from: ethereum.selectedAddress,
          },
          (err, response) => {
            if (err) return reject(err);
            else return resolve(response);
          }
        );
      } else return reject({ message: 'Please install Metamask first' });
    });
  }
}

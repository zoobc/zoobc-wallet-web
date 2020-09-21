import { Injectable } from '@angular/core';
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

export interface Seat {
  tokenId: number;
  zbcAddress?: string;
  ethAddress: string;
  nodePubKey?: string;
  message?: string;
}

export interface SeatsResponse {
  seats: Seat[];
  prev: boolean;
  next: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  constructor() {}

  async search(search: string, page: number = 1): Promise<SeatsResponse> {
    return new Promise((resolve, reject) => {
      if (search.match(/^0x[a-fA-F0-9]{40}$/))
        this.searchByAddress(search, page)
          .then(res => resolve(res))
          .catch(err => reject(err));
      else if (search != '' && Number(search) > -1)
        this.searchByTokenId(Number(search))
          .then(res => resolve(res))
          .catch(err => reject(err));
      else resolve(null);
    });
  }

  private async searchByAddress(address: string, page: number): Promise<SeatsResponse> {
    return new Promise(async (resolve, reject) => {
      if (!web3.utils.isAddress(address)) reject({ error: 'address', message: 'Your address is not valid' });
      const tokenAddress = environment.tokenAddress;
      const abiItem = abi;
      const contract = new web3.eth.Contract(abiItem, tokenAddress);

      const itemPerPage = 10;
      let seats = [];
      let index = (page - 1) * itemPerPage;
      let tokenId = null;
      do {
        try {
          tokenId = await contract.methods.tokenOfOwnerByIndex(address, index).call();
          //console.log(tokenId);
          seats.push({ tokenId, ethAddress: address });
        } catch (err) {
          console.log(err);
          break;
        }
        index++;
      } while (tokenId && index < itemPerPage * page);

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

      tokenId = await contract.methods
        .tokenOfOwnerByIndex(address, index)
        .call()
        .catch(() => {});
      const prev = page == 1 ? false : true;
      const next = tokenId ? true : false;
      const result: SeatsResponse = { prev, next, seats };
      return resolve(result);
    });
  }

  private searchByTokenId(tokenId: number): Promise<SeatsResponse> {
    return new Promise(async (resolve, reject) => {
      const tokenAddress = environment.tokenAddress;
      const abiItem = abi;
      const contract = new web3.eth.Contract(abiItem, tokenAddress);

      try {
        const isExist = await contract.methods.exists(tokenId).call();
        if (isExist) {
          const zbcAddress = await contract.methods.getAccountAddress(tokenId).call();
          const ethAddress = await contract.methods.ownerOf(tokenId).call();

          const result = {
            next: false,
            prev: false,
            seats: [{ zbcAddress, ethAddress, tokenId }],
          };
          return resolve(result);
        }
        return resolve({ next: false, prev: false, seats: [] });
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

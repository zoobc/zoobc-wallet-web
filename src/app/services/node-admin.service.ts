import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NodeHardwareServiceClient } from '../grpc/service/nodeHardwareServiceClientPb';
import { environment } from 'src/environments/environment';
import { GetNodeHardwareRequest } from '../grpc/model/nodeHardware_pb';
import { bigintToByteArray, BigInt } from 'src/helpers/converters';
import { AuthService } from './auth.service';
import { KeyringService } from './keyring.service';

export interface NodeAdminAttribute {
  ipAddress: string;
}

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  nodeAdminServ: NodeHardwareServiceClient;

  private sourceCurrencyNodeAdminAttribue = new BehaviorSubject({});
  nodeAdminAttribute = this.sourceCurrencyNodeAdminAttribue.asObservable();
  attribute: NodeAdminAttribute;

  constructor(
    private http: HttpClient,
    private authServ: AuthService,
    private keyringServ: KeyringService
  ) {
    let attributes = JSON.parse(localStorage.getItem('Node_Admin'));
    this.sourceCurrencyNodeAdminAttribue.next(attributes);

    this.nodeAdminAttribute.subscribe(
      (res: NodeAdminAttribute) => (this.attribute = res)
    );
  }

  getNodeHardwareInfo() {
    return new Promise((resolve, reject) => {
      const account = this.authServ.getCurrAccount();
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed('ZBC', seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        'ZBC',
        account.path
      );

      let bytes = new Buffer(12);
      bytes.set(bigintToByteArray(BigInt(Math.trunc(Date.now() / 1000))), 0);
      bytes.writeInt32LE(1, 8);

      let bytesWithSign = new Buffer(76);
      let signature = childSeed.sign(bytes);
      bytesWithSign.set(bytes, 0);
      bytesWithSign.set(signature, 12);
      console.log(bytesWithSign.toString('base64'));

      let node: NodeHardwareServiceClient = new NodeHardwareServiceClient(
        environment.grpcUrl,
        { authorization: bytesWithSign.toString('base64') },
        null
      );
      console.log(node);

      // const request = new GetNodeHardwareRequest();

      // node.client
    });
  }

  getNodeAdminList() {
    return JSON.parse(localStorage.getItem('Node_Admin'));
  }
  addNodeAdmin(attribute: NodeAdminAttribute) {
    this.sourceCurrencyNodeAdminAttribue.next(attribute);
    localStorage.setItem('Node_Admin', JSON.stringify(attribute));
  }
  updateIPAddress(oldIPAddress, newIPAddress) {
    let nodeAdminIP = JSON.parse(localStorage.getItem('Node_Admin'));
    if (nodeAdminIP.ipAddress == oldIPAddress.ipAddress) {
      nodeAdminIP = newIPAddress;
    }
    this.sourceCurrencyNodeAdminAttribue.next(nodeAdminIP);
    localStorage.setItem('Node_Admin', JSON.stringify(nodeAdminIP));
  }
}

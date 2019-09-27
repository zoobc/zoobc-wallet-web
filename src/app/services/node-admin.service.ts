import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  GetNodeHardwareRequest,
  GetNodeHardwareResponse,
} from '../grpc/model/nodeHardware_pb';
import { bigintToByteArray, BigInt } from 'src/helpers/converters';
import { AuthService } from './auth.service';
import { KeyringService } from './keyring.service';
import { NodeHardwareService } from '../grpc/service/nodeHardware_pb_service';
import { grpc } from '@improbable-eng/grpc-web';
import { RequestType } from '../grpc/model/auth_pb';

export interface NodeAdminAttribute {
  ipAddress: string;
}

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  private sourceCurrencyNodeAdminAttribue = new BehaviorSubject({});
  nodeAdminAttribute = this.sourceCurrencyNodeAdminAttribue.asObservable();
  attribute: NodeAdminAttribute;

  nodeAdminClient: grpc.Client<grpc.ProtobufMessage, grpc.ProtobufMessage>;

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

  streamNodeHardwareInfo() {
    return new Observable(observer => {
      const account = this.authServ.getCurrAccount();
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed('ZBC', seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        'ZBC',
        account.path
      );

      let bytes = new Buffer(12);
      bytes.set(bigintToByteArray(BigInt(Math.trunc(Date.now() / 1000))), 0);
      bytes.writeInt32LE(RequestType.GETNODEHARDWARE, 8);

      let bytesWithSign = new Buffer(80);
      let signature = childSeed.sign(bytes);
      bytesWithSign.set(bytes, 0);
      bytesWithSign.writeInt32LE(0, 12);
      bytesWithSign.set(signature, 16);
      // console.log(bytesWithSign);

      const request = new GetNodeHardwareRequest();

      this.nodeAdminClient = grpc.client(NodeHardwareService.GetNodeHardware, {
        host: environment.grpcUrl,
      });
      this.nodeAdminClient.onHeaders((headers: grpc.Metadata) => {
        console.log('onHeaders', headers);
      });
      this.nodeAdminClient.onMessage((message: GetNodeHardwareResponse) => {
        // console.log('onMessage', message.toObject());
        observer.next(message.toObject());
      });
      this.nodeAdminClient.onEnd(
        (status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
          console.log('onEnd', status, statusMessage, trailers);
        }
      );

      this.nodeAdminClient.start(
        new grpc.Metadata({ authorization: bytesWithSign.toString('base64') })
      );
      this.nodeAdminClient.send(request);
      this.nodeAdminClient.finishSend();
    });
  }

  stopNodeHardwareInfo() {
    this.nodeAdminClient.close();
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

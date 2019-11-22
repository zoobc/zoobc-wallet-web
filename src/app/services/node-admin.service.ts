import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetNodeHardwareRequest,
  GetNodeHardwareResponse,
} from '../grpc/model/nodeHardware_pb';
import { AuthService, SavedAccount } from './auth.service';
import { KeyringService } from './keyring.service';
import { NodeHardwareService } from '../grpc/service/nodeHardware_pb_service';
import { NodeAdminService as NodeAdminServ } from '../grpc/service/nodeAdmin_pb_service';
import { grpc } from '@improbable-eng/grpc-web';
import { RequestType } from '../grpc/model/auth_pb';
import {
  GenerateNodeKeyRequest,
  GenerateNodeKeyResponse,
} from '../grpc/model/node_pb';
import { poownBuilder } from 'src/helpers/transaction-builder/poown';

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  nodeAdminClient: grpc.Client<grpc.ProtobufMessage, grpc.ProtobufMessage>;

  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService
  ) {}

  streamNodeHardwareInfo() {
    return new Observable(observer => {
      const account = this.authServ.getCurrAccount();
      const auth = poownBuilder(RequestType.GETNODEHARDWARE, this.keyringServ);
      const request = new GetNodeHardwareRequest();

      this.nodeAdminClient = grpc.client(NodeHardwareService.GetNodeHardware, {
        host: `${account.nodeIP}`,
      });
      this.nodeAdminClient.onMessage((message: GetNodeHardwareResponse) => {
        observer.next(message.toObject());
      });
      this.nodeAdminClient.onEnd(
        (status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
          if (status != grpc.Code.OK) observer.error(statusMessage);
        }
      );

      this.nodeAdminClient.start(new grpc.Metadata({ authorization: auth }));
      this.nodeAdminClient.send(request);
      this.nodeAdminClient.finishSend();
    });
  }

  stopNodeHardwareInfo() {
    this.nodeAdminClient && this.nodeAdminClient.close();
  }

  generateNodeKey(nodeIP: string) {
    return new Promise((resolve, reject) => {
      const auth = poownBuilder(RequestType.GENERATETNODEKEY, this.keyringServ);
      const request = new GenerateNodeKeyRequest();
      const client = grpc.client(NodeAdminServ.GenerateNodeKey, {
        host: nodeIP,
      });

      client.onMessage((message: GenerateNodeKeyResponse) => {
        resolve(message.toObject());
      });
      client.onEnd(
        (status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
          if (status != grpc.Code.OK) reject(statusMessage);
        }
      );

      client.start(new grpc.Metadata({ authorization: auth }));
      client.send(request);
      client.finishSend();
    });
  }

  addNodeAdmin(ip: string) {
    let account: SavedAccount = this.authServ.getCurrAccount();
    let accounts: SavedAccount[] = this.authServ.getAllAccount();

    account.nodeIP = ip;
    accounts = accounts.map((acc: SavedAccount) => {
      if (acc.path == account.path) acc = account;
      return acc;
    });

    localStorage.setItem('CURR_ACCOUNT', JSON.stringify(account));
    localStorage.setItem('ACCOUNT', JSON.stringify(accounts));
  }
}

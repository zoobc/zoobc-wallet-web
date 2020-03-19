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
import { Node } from 'src/helpers/node-list';

@Injectable({
  providedIn: 'root',
})
export class NodeAdminService {
  nodeAdminClient: grpc.Client<grpc.ProtobufMessage, grpc.ProtobufMessage>;

  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService
  ) {}

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

import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import { environment } from 'src/environments/environment';
import { NodeRegistrationService as NodeRegistrationServ } from '../grpc/service/nodeRegistration_pb_service';
import {
  GetNodeRegistrationRequest,
  GetNodeRegistrationResponse,
  NodeAddress,
} from '../grpc/model/nodeRegistration_pb';
import { SavedAccount } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NodeRegistrationService {
  constructor() {}

  getRegisteredNode(account: SavedAccount) {
    return new Promise((resolve, reject) => {
      const nodeAddress = new NodeAddress();
      nodeAddress.setAddress('18.139.3.139');
      // nodeAddress.setPort(5001);

      const request = new GetNodeRegistrationRequest();
      request.setAccountaddress(account.address);
      request.setNodeaddress(nodeAddress);

      grpc.invoke(NodeRegistrationServ.GetNodeRegistration, {
        host: environment.grpcUrl,
        request: request,
        onMessage: (message: GetNodeRegistrationResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          console.log('msg', msg);
          if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }
}

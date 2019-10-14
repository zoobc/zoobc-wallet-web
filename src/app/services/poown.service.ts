import { Injectable } from '@angular/core';
import {
  GetProofOfOwnershipRequest,
  ProofOfOwnership,
} from '../grpc/model/proofOfOwnership_pb';
import { grpc } from '@improbable-eng/grpc-web';
import { environment } from 'src/environments/environment';
import { NodeAdminService } from '../grpc/service/proofOfOwnership_pb_service';
import { KeyringService } from './keyring.service';
import { RequestType } from '../grpc/model/auth_pb';
import { poownBuilder } from 'src/helpers/transaction-builder/poown';

@Injectable({
  providedIn: 'root',
})
export class PoownService {
  constructor(private keyringServ: KeyringService) {}

  get(ip: string = environment.grpcUrl): Promise<Buffer> {
    ip = ip.startsWith('http://') ? ip : `http://${ip}`;

    return new Promise((resolve, reject) => {
      let auth = poownBuilder(
        RequestType.GETPROOFOFOWNERSHIP,
        this.keyringServ
      );

      const request = new GetProofOfOwnershipRequest();

      let client = grpc.client(NodeAdminService.GetProofOfOwnership, {
        host: ip,
      });

      client.onMessage((message: ProofOfOwnership) => {
        const bytes = Buffer.concat([
          Buffer.from(message.toObject().messagebytes.toString(), 'base64'),
          Buffer.from(message.toObject().signature.toString(), 'base64'),
        ]);

        resolve(bytes);
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
}

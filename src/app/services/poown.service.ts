import { Injectable } from '@angular/core';
import {
  GetProofOfOwnershipRequest,
  ProofOfOwnership,
} from '../grpc/model/proofOfOwnership_pb';
import { grpc } from '@improbable-eng/grpc-web';
import { environment } from 'src/environments/environment';
import { NodeAdminService } from '../grpc/service/proofOfOwnership_pb_service';
import { AuthService } from './auth.service';
import { KeyringService } from './keyring.service';
import { RequestType } from '../grpc/model/auth_pb';
import { bigintToByteArray, BigInt } from 'src/helpers/converters';

@Injectable({
  providedIn: 'root',
})
export class PoownService {
  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService
  ) {}

  get(ip: string = environment.grpcUrl): Promise<Buffer> {
    ip = ip.startsWith('http://') ? ip : `http://${ip}`;

    return new Promise((resolve, reject) => {
      const account = this.authServ.getCurrAccount();
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed('ZBC', seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        'ZBC',
        account.path
      );

      let bytes = new Buffer(12);
      let timestamp = BigInt(Date.now());
      bytes.set(bigintToByteArray(timestamp), 0);
      bytes.writeInt32LE(RequestType.GETPROOFOFOWNERSHIP, 8);

      let bytesWithSign = new Buffer(80);
      let signature = childSeed.sign(bytes);
      bytesWithSign.set(bytes, 0);
      bytesWithSign.writeInt32LE(0, 12);
      bytesWithSign.set(signature, 16);

      const request = new GetProofOfOwnershipRequest();

      let client = grpc.client(NodeAdminService.GetProofOfOwnership, {
        host: ip,
      });

      client.onHeaders((headers: grpc.Metadata) => {
        // console.log('onHeaders', headers);
      });
      client.onMessage((message: ProofOfOwnership) => {
        // console.log('onMessage', message.toObject());
        // console.log(
        //   Buffer.from(message.toObject().messagebytes.toString(), 'base64')
        // );
        // console.log(
        //   Buffer.from(message.toObject().signature.toString(), 'base64')
        // );

        let bytes = new Buffer(144);
        bytes.set(
          Buffer.from(message.toObject().messagebytes.toString(), 'base64'),
          0
        );
        bytes.set(
          Buffer.from(message.toObject().signature.toString(), 'base64'),
          80
        );

        resolve(bytes);
      });
      client.onEnd(
        (status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
          // console.log('onEnd', status, statusMessage, trailers);
          // console.log(status);

          if (status != grpc.Code.OK) reject(statusMessage);
        }
      );

      client.start(
        new grpc.Metadata({ authorization: bytesWithSign.toString('base64') })
      );
      client.send(request);
      client.finishSend();
    });
  }
}

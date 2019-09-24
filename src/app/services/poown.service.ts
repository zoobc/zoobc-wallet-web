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

  get() {
    return new Promise((resolve, reject) => {
      const account = this.authServ.getCurrAccount();
      const seed = Buffer.from(this.authServ.currSeed, 'hex');

      this.keyringServ.calcBip32RootKeyFromSeed('ZBC', seed);
      const childSeed = this.keyringServ.calcForDerivationPathForCoin(
        'ZBC',
        account.path
      );

      let bytes = new Buffer(12);
      let timestamp = BigInt(Math.trunc(Date.now() / 1000));
      bytes.set(bigintToByteArray(timestamp), 0);
      bytes.writeInt32LE(RequestType.GETPROOFOFOWNERSHIP, 8);

      let bytesWithSign = new Buffer(80);
      let signature = childSeed.sign(bytes);
      bytesWithSign.set(bytes, 0);
      bytesWithSign.writeInt32LE(0, 12);
      bytesWithSign.set(signature, 16);
      // console.log(bytesWithSign);

      const request = new GetProofOfOwnershipRequest();

      let client = grpc.client(NodeAdminService.GetProofOfOwnership, {
        host: environment.grpcUrl,
      });

      client.onHeaders((headers: grpc.Metadata) => {
        console.log('onHeaders', headers);
      });
      client.onMessage((message: ProofOfOwnership) => {
        console.log('onMessage', message.toObject());
        // console.log(
        //   Buffer.from(message.toObject().messagebytes.toString(), 'base64')
        // );
        // console.log(
        //   Buffer.from(message.toObject().signature.toString(), 'base64')
        // );

        let bytes = new Uint8Array(180);
        bytes.set(
          Buffer.from(message.toObject().messagebytes.toString(), 'base64'),
          0
        );
        bytes.set(
          Buffer.from(message.toObject().signature.toString(), 'base64'),
          112
        );

        resolve(bytes);

        // console.log(message.toObject().messagebytes.toString());

        // let bytes = Buffer.from(
        //   message.toObject().messagebytes.toString(),
        //   'base64'
        // );
        // console.log(bytes);

        // console.log(bytes.readInt32LE(64));
      });
      client.onEnd(
        (status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
          // console.log('onEnd', status, statusMessage, trailers);
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

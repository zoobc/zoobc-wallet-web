import { Injectable } from '@angular/core';
import {
  GetProofOfOwnershipRequest,
  ProofOfOwnershipMessage,
  ProofOfOwnership,
} from '../grpc/model/proofOfOwnership_pb';
import { grpc } from '@improbable-eng/grpc-web';
import { environment } from 'src/environments/environment';
import { NodeAdminService } from '../grpc/service/proofOfOwnership_pb_service';
import { NodeRegistrationService as NodeRegistrationServ } from '../grpc/service/nodeRegistration_pb_service';
import { AuthService } from './auth.service';
import { KeyringService } from './keyring.service';
import { RequestType } from '../grpc/model/auth_pb';
import { bigintToByteArray, BigInt } from 'src/helpers/converters';
import {
  GetNodeRegistrationsRequest,
  GetNodeRegistrationsResponse,
  GetNodeRegistrationRequest,
  GetNodeRegistrationResponse,
  NodeRegistration,
} from '../grpc/model/nodeRegistration_pb';
import { transactionByte } from 'src/helpers/transactionByteTemplate';
import { BytesMaker } from 'src/helpers/BytesMaker';

@Injectable({
  providedIn: 'root',
})
export class NodeRegistrationService {
  constructor(
    private authServ: AuthService,
    private keyringServ: KeyringService
  ) {}

  getRegisteredNode() {
    return new Promise((resolve, reject) => {
      const request = new GetNodeRegistrationRequest();
      request.setAccountaddress('BCZEGOb3WNx3fDOVf9ZS4EjvOIv_UeW4TVBQJ_6tHKlE');
      request.setRegistrationheight(0);
      request.setNodepublickey(
        new Uint8Array([
          153,
          58,
          50,
          200,
          7,
          61,
          108,
          229,
          204,
          48,
          199,
          145,
          21,
          99,
          125,
          75,
          49,
          45,
          118,
          97,
          219,
          80,
          242,
          244,
          100,
          134,
          144,
          246,
          37,
          144,
          213,
          135,
        ])
      );

      let client = grpc.invoke(NodeRegistrationServ.GetNodeRegistration, {
        host: environment.grpcUrl,
        request: request,
        onMessage: (message: GetNodeRegistrationResponse) => {
          resolve(message.toObject());
          // console.log(message.toObject());
          // console.log('message', message);
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

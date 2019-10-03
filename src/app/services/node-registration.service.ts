import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import { environment } from 'src/environments/environment';
import { NodeRegistrationService as NodeRegistrationServ } from '../grpc/service/nodeRegistration_pb_service';
import {
  GetNodeRegistrationRequest,
  GetNodeRegistrationResponse,
} from '../grpc/model/nodeRegistration_pb';

@Injectable({
  providedIn: 'root',
})
export class NodeRegistrationService {
  constructor() {}

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

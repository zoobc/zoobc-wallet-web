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
      request.setAccountaddress('nK_ouxdDDwuJiogiDAi_zs1LqeN7f5ZsXbFtXGqGc0Pd');
      request.setRegistrationheight(0);
      request.setNodepublickey('Keu41kYXmVloKfr4MwdFWeq1ZKMtRZhGNMmTRgbyNNw=');

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

import { Injectable } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import { NodeRegistrationService as NodeRegistrationServ } from '../grpc/service/nodeRegistration_pb_service';
import {
  GetNodeRegistrationRequest,
  GetNodeRegistrationResponse,
  NodeAddress,
} from '../grpc/model/nodeRegistration_pb';
import { SavedAccount } from './auth.service';
import {
  GetMempoolTransactionsRequest,
  GetMempoolTransactionsResponse,
} from '../grpc/model/mempool_pb';
import { Pagination, OrderBy } from '../grpc/model/pagination_pb';
import { MempoolService } from '../grpc/service/mempool_pb_service';
import {
  REGISTER_NODE_TYPE,
  UPDATE_NODE_TYPE,
  REMOVE_NODE_TYPE,
  CLAIM_NODE_TYPE,
} from 'src/helpers/transaction-builder/constant';
import { Node } from 'src/helpers/node-list';

@Injectable({
  providedIn: 'root',
})
export class NodeRegistrationService {
  constructor() {}

  getRegisteredNode(account: SavedAccount) {
    return new Promise((resolve, reject) => {
      const node: Node = JSON.parse(localStorage.getItem('SELECTED_NODE'));

      const nodeAddress = new NodeAddress();
      nodeAddress.setAddress('18.139.3.139');
      // nodeAddress.setPort(5001);

      const request = new GetNodeRegistrationRequest();
      request.setAccountaddress(account.address);
      request.setNodeaddress(nodeAddress);

      grpc.invoke(NodeRegistrationServ.GetNodeRegistration, {
        host: node.ip,
        request: request,
        onMessage: (message: GetNodeRegistrationResponse) => {
          resolve(message.toObject());
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code == grpc.Code.NotFound) resolve({ noderegistration: null });
          else if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }

  getUnconfirmTransaction(address: string) {
    return new Promise((resolve, reject) => {
      const node: Node = JSON.parse(localStorage.getItem('SELECTED_NODE'));

      const request = new GetMempoolTransactionsRequest();
      const pagination = new Pagination();
      pagination.setOrderby(OrderBy.DESC);
      request.setAddress(address);
      request.setPagination(pagination);

      grpc.invoke(MempoolService.GetMempoolTransactions, {
        request: request,
        host: node.ip,
        onMessage: (message: GetMempoolTransactionsResponse) => {
          let mempoolTx = message.toObject().mempooltransactionsList;
          let res: any = null;
          for (let i = 0; i < mempoolTx.length; i++) {
            const tx = mempoolTx[i].transactionbytes;
            const txBytes = Buffer.from(tx.toString(), 'base64');
            const type = txBytes.slice(0, 4).readInt32LE(0);
            console.log(type);

            let found = false;
            switch (type) {
              case REGISTER_NODE_TYPE:
                found = true;
                res = { type: 'Register Node', tx: mempoolTx };
                break;
              case UPDATE_NODE_TYPE:
                found = true;
                res = { type: 'Update Node', tx: mempoolTx };
                break;
              case REMOVE_NODE_TYPE:
                found = true;
                res = { type: 'Remove Node', tx: mempoolTx };
                break;
              case CLAIM_NODE_TYPE:
                found = true;
                res = { type: 'Claim Node', tx: mempoolTx };
                break;
            }

            if (found) break;
          }
          resolve(res);
        },
        onEnd: (
          code: grpc.Code,
          msg: string | undefined,
          trailers: grpc.Metadata
        ) => {
          if (code != grpc.Code.OK) reject(msg);
        },
      });
    });
  }
}

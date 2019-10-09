import { AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';

export class RegisterNode {
  private bytes: Buffer;

  authServ: AuthService;
  keyringServ: KeyringService;

  constructor() {}
}

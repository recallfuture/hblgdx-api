import { provide } from 'midway';
import { JwxtApi } from '../api/jwxt';

@provide()
export class JwxtService {
  async getValidateCode() {
    return JwxtApi.getValidateCode();
  }

  async login(username: string, password: string, code: string) {
    return JwxtApi.login(username, password, code);
  }

  async logout() {
    return JwxtApi.logout();
  }
}

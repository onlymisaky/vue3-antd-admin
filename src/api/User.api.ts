import { User } from '@/models/User.model';
import { http } from '@/utils/http';

export class UserApi {
  static getUserInfo(): HttpResponseP<User> {
    return http.get('/user');
  }
}

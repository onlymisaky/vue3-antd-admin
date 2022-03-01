import { User } from '@/models/User.model';
import { http } from '@/utils/http';

export class UserApi {
  static login(): HttpResponseP<User> {
    return http.post('/login');
  }

  static logout(): HttpResponseP<User> {
    return http.post('/logout');
  }

  static getUserInfo(): HttpResponseP<User> {
    return http.get('/user');
  }
}

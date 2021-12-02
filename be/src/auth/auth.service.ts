import { Injectable, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private accountService: UserService, private jwtService: JwtService
  ) { }


  async validateUser(accountname, pass) {
    const user = await this.accountService.findOne(accountname);
    if (user && user.id === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

}

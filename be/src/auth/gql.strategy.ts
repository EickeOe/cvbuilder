import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class GqlStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: (req) => {
        if (req?.headers?.token) {
          return req.headers.token
        }
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload
  ): Promise<any> {
    return { name: payload.name, id: payload.id };
  }
}

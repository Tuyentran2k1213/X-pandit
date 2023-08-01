import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { jsonWebToken } from '../enviroment-variables';

interface UserValidate {
    sub: string;
    username: string;
    email: string;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jsonWebToken.secretQuestion,
        })
    }

    async validate(payload: UserValidate) {
        return { _id: payload.sub, name: payload.username, email: payload.email };
      }
}
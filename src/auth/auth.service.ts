import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/auth-register.dto';
import { LoginDto, LoginResultDto, UpdateAuthDto } from './dto/auth-login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { comparePassword, jsonWebToken } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService){}

  register(registerInfo: RegisterDto): Promise<User> {
    return this.userService.create(registerInfo);
  }

  async login(loginInfo: LoginDto): Promise<LoginResultDto> {
    try {
      const user = await this.userService.findOneByEmail(loginInfo.email);
      const isUserVerify = await comparePassword(loginInfo.password, user.password);
      if(!isUserVerify) throw new UnauthorizedException('Incorrect password!!!');
      const token = await this.convertToJwtString(
        user._id,
        user.name,
        user.email,
      );
        return {
          user,
          token: token,
        };
      
    } catch(err) {
      throw new HttpException("User not found!", 400, { cause: new Error(err) })
    }
  }

  // jwt verify
  async verifyJwt(token: string) {
    try{
      const result = await this.jwtService.verifyAsync(token, {
        secret: jsonWebToken.secretQuestion,
      });
      const userInfo = await this.userService.findOneByEmail(result?.email);
      if(!userInfo) throw new UnauthorizedException();
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  // jwt generator
  async convertToJwtString(
    userId: string,
    userName: string,
    email: string,): Promise<string> {
    const payload = { sub: userId, userName, email };
    return this.jwtService.signAsync(payload, {
      expiresIn: jsonWebToken.expiresTime,
      secret: jsonWebToken.secretQuestion,
    })
  }
}

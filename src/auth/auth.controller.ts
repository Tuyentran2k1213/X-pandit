import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth-register.dto';
import { LoginDto } from './dto/auth-login.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerInfo: RegisterDto): Promise<User> {
    return this.authService.register(registerInfo);
  }
  
  @Post('login')
  login(@Body() loginInfo: LoginDto) {
    return this.authService.login(loginInfo);
  }

}

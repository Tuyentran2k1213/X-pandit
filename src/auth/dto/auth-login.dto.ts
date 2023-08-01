import { PartialType, PickType } from '@nestjs/swagger';
import { RegisterDto } from './auth-register.dto';
import { User } from 'src/user/entities/user.entity';

export class UpdateAuthDto extends PartialType(RegisterDto) {}

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}
export class LoginResultDto {
    user: User;
    token: string;
}
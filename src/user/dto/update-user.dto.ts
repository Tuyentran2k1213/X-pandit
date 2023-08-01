import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Status } from 'src/utils';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
    @ApiPropertyOptional()
    status: Status;

    @ApiPropertyOptional()
    time_left: number;
}
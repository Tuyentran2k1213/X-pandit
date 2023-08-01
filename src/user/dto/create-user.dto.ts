import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role, S3File } from "src/utils";

export class CreateUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    date_of_birth: string;

    @ApiProperty()
    role: Role;

    @ApiPropertyOptional()
    avatar?: S3File;

    @ApiProperty()
    password: string;
}

export class UserIdsDto {
    @ApiProperty()
    userIds: string[];
}

export class FilterUser {
    @ApiProperty()
    filters: Object;
}
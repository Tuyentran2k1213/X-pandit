import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EmployeeStatus, S3File } from "src/utils";

export class CreateEmployeeDto {
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    date: string;

    @ApiProperty()
    working_date: number;

    @ApiProperty()
    date_off: number;

    @ApiProperty()
    salary_per_date: number;

    @ApiPropertyOptional()
    status?: EmployeeStatus;

    @ApiPropertyOptional()
    avatar?: S3File;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class EmployeeIdsDto {
    @ApiProperty()
    employee_ids: string[];
}

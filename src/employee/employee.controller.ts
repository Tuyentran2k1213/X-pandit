import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeIdsDto, UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeStatus, JWTAuthGuard } from 'src/utils';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: EmployeeStatus })
  findAll(@Query('status') status?: EmployeeStatus) {
    return this.employeeService.findAll(status);
  }

  @Get('deleted')
  @ApiQuery({ name: 'status', required: false, enum: EmployeeStatus })
  getDeleted(@Query('status') status?: EmployeeStatus): Promise<Employee[]> {
    return this.employeeService.getDeleted(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Patch('softDelete')
  delete(@Body() body: EmployeeIdsDto): Promise<string> {
    return this.employeeService.delete(body);
  }

  @Patch('restore')
  restore(@Body() body: EmployeeIdsDto): Promise<string> {
    return this.employeeService.restore(body);
  }

  @Delete('hardDelete')
  remove(@Body() body: EmployeeIdsDto) {
    return this.employeeService.remove(body);
  }
}

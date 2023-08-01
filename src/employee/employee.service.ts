import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeIdsDto, UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeStatus } from 'src/utils';

interface EmployeeModel extends Model<EmployeeDocument>{}

@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private readonly employeeModel: EmployeeModel){}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const newEmployee = new this.employeeModel(createEmployeeDto);
      const data = await newEmployee.save();
      return data;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async findAll(status?: EmployeeStatus) {
    try {
      if(status){
        const employees = await this.employeeModel.find({ deleted: false, status });
        return employees;
      } else {
        const employees = await this.employeeModel.find({ deleted: false });
        return employees;
      }
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async findOne(id: string) {
    try {
      const employee = await this.employeeModel.findOne({ _id: id, deleted: false });
      if(!employee) throw new HttpException('not found!!!', HttpStatus.FORBIDDEN);
      return employee;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const result = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {new: true});
      return result;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async delete(body: EmployeeIdsDto): Promise<string> {
    try {
      await this.employeeModel.updateMany({ _id: { $in: body.employee_ids } }, { deleted: true, deletedAt: new Date() });
      return 'Delete employee successful !!!'
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async restore(body: EmployeeIdsDto): Promise<string> {
    try {
      await this.employeeModel.updateMany({ _id: { $in: body.employee_ids } }, { deleted: false });
      return "Restore employees successful!!!";
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async getDeleted(status?: EmployeeStatus): Promise<Employee[]> {
    try {
      if(status){
        const deleted = await this.employeeModel.find({ deleted: true, status });
        return deleted;
      } else {
        const deleted = await this.employeeModel.find({ deleted: true });
        return deleted;
      }
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async remove(body: EmployeeIdsDto) {
    try {
      await this.employeeModel.deleteMany({ _id: { $in: body.employee_ids } });
      return 'These employee is complete deleted !!!';
     } catch(err){
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
     }
  }
}

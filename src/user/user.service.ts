import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto, FilterUser, UserIdsDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { hashingPassword } from 'src/utils';

export interface UserModel extends Model<UserDocument> {}

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: UserModel){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      const hashPassword = await hashingPassword(createUserDto.password);
    const newUserData = {...createUserDto, password: hashPassword };

    const newUser = new this.userModel(newUserData);
    const result = await newUser.save();
    return result;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async findAll(filter: FilterUser): Promise<User[]> {
    try {
      const users = await this.userModel.find({ ...filter, deleted: false });
      return users;
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: id, deleted: false });
      if(!user) throw new HttpException('not found!!!', HttpStatus.FORBIDDEN);
      return user;
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email, deleted: false });
      if(!user) throw new HttpException('Email not found!!!', HttpStatus.FORBIDDEN);
      return user;
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const result = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true});
      return result;
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN); 
    }
  }

  async delete(body: UserIdsDto): Promise<string> {
    try {
      await this.userModel.updateMany({ _id: { $in: body.userIds } }, { deleted: true, deletedAt: new Date() });
      return 'Delete User successful !!!'
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN); 
    }
  }

  async restore(body: UserIdsDto) {
    try {
      await this.userModel.updateMany({ _id: { $in: body.userIds } }, { deleted: false });
      return 'Delete User successful !!!'
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN); 
    }
  }

  async getDeleted(): Promise<User[]> {
    try {
      const deletedUsers = await this.userModel.find({ deleted: true });
      return deletedUsers;
    } catch(err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN); 
    }
  }

  async remove(body: UserIdsDto): Promise<string> {
   try {
    await this.userModel.deleteMany({ _id: { $in: body.userIds } });
    return 'These users is complete deleted !!!';
   } catch(err){
    throw new HttpException(err, HttpStatus.FORBIDDEN);
   }
  }
}

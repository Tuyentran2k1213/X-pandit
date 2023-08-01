import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionIdsDto, UpdateTransactionDto, UpdateTransactionStatusDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './entities/transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Status, TransactionStatus } from 'src/utils';
import { User, UserDocument } from 'src/user/entities/user.entity';

interface TransactionModel extends Model<TransactionDocument>{}

@Injectable()
export class TransactionService {

  constructor(@InjectModel(Transaction.name) private readonly transactionModel: TransactionModel,@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const newTransaction = new this.transactionModel(createTransactionDto);
      const data = await newTransaction.save();
      return data;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async findAll(status?: TransactionStatus) {
    try {
      if(status){
        const transactions = await this.transactionModel.find({ deleted: false, status }).populate('user');
        return transactions;
      } else {
        const transactions = await this.transactionModel.find({ deleted: false }).populate('user');
        return transactions;
      }
      
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async findOne(id: string) {
    try {
      const transaction = await this.transactionModel.findOne({ _id: id, deleted: false });
      if(!transaction) throw new HttpException('not found!!!', HttpStatus.FORBIDDEN);
      return transaction;
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async update(id: string, updateTransactionStatusDto: UpdateTransactionStatusDto) {
    if(!updateTransactionStatusDto.status) throw new HttpException('data not found', HttpStatus.FORBIDDEN);
    try {
      const transactionData = await this.transactionModel.findByIdAndUpdate(
      id, { $set: { status: updateTransactionStatusDto.status, isNew: false } },
      { new: true },);
      const userInfo = await this.userModel.findById(transactionData.user);

      if(updateTransactionStatusDto.status === TransactionStatus.active && updateTransactionStatusDto.active_time){
        const newTimeLeft = userInfo.time_left + updateTransactionStatusDto.active_time;
        await this.userModel.findByIdAndUpdate(
          userInfo._id,
          { $set: { time_left: newTimeLeft, status: Status.active } },
          { new: true },
        );
      } else if(updateTransactionStatusDto.status === TransactionStatus.pending) {
        await this.userModel.findByIdAndUpdate(
          userInfo._id,
          { $set: { status: Status.pending } },
          { new: true },
        );
      } else if(updateTransactionStatusDto.status === TransactionStatus.rejected) {
        await this.userModel.findByIdAndUpdate(
          userInfo._id,
          { $set: { status: Status.rejected } },
          { new: true },
        );
      }

      return transactionData;
      
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async delete(body: TransactionIdsDto): Promise<string> {
    try {
      await this.transactionModel.updateMany({ _id: { $in: body.transaction_ids } }, { deleted: true, deletedAt: new Date() });
      return 'Delete transaction successful !!!'
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async restore(body: TransactionIdsDto) {
    try {
      await this.transactionModel.updateMany({ _id: { $in: body.transaction_ids } }, { deleted: false });
      return "Restore successful!!!";
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async getDeleted(status?: TransactionStatus): Promise<Transaction[]> {
    try {
      if(status) {
        const deleted = await this.transactionModel.find({ deleted: true, status });
        return deleted;
      } else {
        const deleted = await this.transactionModel.find({ deleted: true });
        return deleted;
      }
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err }); 
    }
  }

  async remove(body: TransactionIdsDto) {
    try {
      await this.transactionModel.deleteMany({ _id: { $in: body.transaction_ids } });
      return 'These transaction is complete deleted !!!';
     } catch(err){
      throw new HttpException(err.message, HttpStatus.FORBIDDEN, { cause: err });
     }
  }
}

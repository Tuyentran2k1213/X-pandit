import { Module } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}]), 
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
      ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}

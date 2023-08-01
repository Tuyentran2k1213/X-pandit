import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JWTStrategy, database } from './utils';
import { FileModule } from './file/file.module';
import { EmployeeModule } from './employee/employee.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forRoot(database.dbAddress),
    RouterModule.register([{
      path: 'api',
      module: AppModule,
      children: [AuthModule, UserModule, FileModule, EmployeeModule],    
    }]), AuthModule, UserModule, FileModule, EmployeeModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService, JWTStrategy],
})
export class AppModule {}

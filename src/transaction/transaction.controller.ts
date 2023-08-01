import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionIdsDto, UpdateTransactionDto, UpdateTransactionStatusDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard, TransactionStatus } from 'src/utils';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Transaction')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
  findAll(@Query('status') status?: TransactionStatus) {
    return this.transactionService.findAll(status);
  }

  @Get('deleted')
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
  getDeleted(@Query('status') status?: TransactionStatus): Promise<Transaction[]> {
    return this.transactionService.getDeleted(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Put('update-transaction/:id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionStatusDto) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Patch('softDelete')
  delete(@Body() body: TransactionIdsDto): Promise<string> {
    return this.transactionService.delete(body);
  }

  @Patch('restore')
  restore(@Body() body: TransactionIdsDto): Promise<string> {
    return this.transactionService.restore(body);
  }

  @Delete('hardDelete')
  remove(@Body() body: TransactionIdsDto) {
    return this.transactionService.remove(body);
  }
}

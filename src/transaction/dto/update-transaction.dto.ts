import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { TransactionStatus } from 'src/utils';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    @ApiProperty()
    status: TransactionStatus;
}

export class UpdateTransactionStatusDto {
    @ApiProperty({ enum: TransactionStatus })
    status: TransactionStatus;

    @ApiPropertyOptional()
    active_time?: number;
}

export class TransactionIdsDto {
    transaction_ids: string[];
}

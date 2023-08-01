import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    user: string;

    @ApiProperty()
    bonus_month: number;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { TransactionStatus } from 'src/utils';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: User;

    @Prop()
    bonus_month: number;

    @Prop({ default: true })
    isNew: boolean;
    
    @Prop({ default: TransactionStatus.pending })
    status: TransactionStatus;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EmployeeStatus, S3File } from 'src/utils';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema()
export class Employee {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    working_date: number;

    @Prop({ required: true })
    date_off: number;

    @Prop({ required: true })
    salary_per_date: number;

    @Prop({ default: EmployeeStatus.pending })
    status?: EmployeeStatus;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    avatar?: S3File;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
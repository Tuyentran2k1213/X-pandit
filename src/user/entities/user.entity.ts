import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role, S3File, Status } from 'src/utils';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    date_of_birth: string;
    
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 0 })
    time_left: number;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    avatar: S3File;

    @Prop({ default: Role.user })
    role: Role;

    @Prop({ default: Status.pending })
    status: Status;

    @Prop({ default: new Date() })
    createdAt: Date;

    @Prop({ default: new Date() })
    updatedAt: Date;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
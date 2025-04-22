import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CustomSchema } from './decorator';
import mongoose, { Types } from 'mongoose';
import { User } from './user.schema';

@CustomSchema
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);

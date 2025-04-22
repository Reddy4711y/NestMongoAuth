import { Schema } from '@nestjs/mongoose';

export const CustomSchema = Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform(doc, ret, options) {
      const id = ret._id.toString();
      delete ret._id;

      return {
        id,
        ...ret,
      };
    },
  },
});

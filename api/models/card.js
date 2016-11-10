import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CardSchema = new Schema({
  number  : {type: Number },
  pin     : {type: Number },
  cvv     : {type: Number },
  explDate: {type: Date   },
  owner   : {type: Schema.ObjectId}
});

export const Card = mongoose.model('cards', CardSchema);
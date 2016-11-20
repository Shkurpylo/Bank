import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  number: { type: Number },
  name: { type: String },
  pin: { type: Number },
  cvv: { type: Number },
  explDate: { type: Date },
  owner: { type: Schema.ObjectId }
});

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  cards: [CardSchema]

});

export const User = mongoose.model('users', UserSchema);
export const Card = mongoose.model('cards', CardSchema);

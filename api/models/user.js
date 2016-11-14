import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  number  : {type: Number},
  name    : {type: String},
  pin     : {type: Number},
  cvv     : {type: Number},
  explDate: {type: Date},
  owner   : {type: Schema.ObjectId}
});

const UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName : {type: String, required: true},
  email    : {type: String, required: true},
  password : {type: String, required: true},
  cards    : [CardSchema]

});

export const User = mongoose.model('users', UserSchema);
export const Card = mongoose.model('cards', CardSchema);




import mongoose from 'mongoose';
import {Card, CardSchema} from './card';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName : {type: String, required: true},
  email    : {type: String, required: true},
  password : {type: String, required: true},
  cards    : [CardSchema]

});

export const User = mongoose.model('users', UserSchema);


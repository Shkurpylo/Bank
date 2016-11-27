import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const CardSchema = mongoose.Schema({ // eslint-disable-line new-cap
  number: { type: Number },
  name: { type: String },
  pin: { type: Number },
  cvv: { type: Number },
  explDate: { type: Date },
  owner: { type: Schema.ObjectId }
});

const UserSchema = mongoose.Schema({ // eslint-disable-line new-cap
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  cards: [CardSchema]

});

UserSchema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hashPass = await bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  this.password = hashPass;
  next();
});

export const User = mongoose.model('users', UserSchema);
export const Card = mongoose.model('cards', CardSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const CardSchema = mongoose.Schema({ // eslint-disable-line new-cap
  number: { type: Number, required: true },
  name: { type: String, required: true },
  pin: { type: Number, required: true },
  cvv: { type: Number, required: true },
  explDate: { type: Date, required: true },
  owner: { type: Schema.ObjectId, required: true },
  active: { type: Boolean, default: true, required: true }
});

const UserSchema = mongoose.Schema({ // eslint-disable-line new-cap
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
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

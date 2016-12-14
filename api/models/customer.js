import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CustomerSchema = mongoose.Schema({ // eslint-disable-line new-cap
  name: { type: String, Required: true },
  uuid: { type: String, Required: true },
  account: { type: Schema.ObjectId, Required: true },
  cardId: { type: Schema.ObjectId, Required: true },
  cardNumber: {type: Number, Required: true}
});

export const Customer = mongoose.model('customers', CustomerSchema);

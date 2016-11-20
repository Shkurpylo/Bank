import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: { type: Schema.ObjectId, required: true },
  receiver: { type: Schema.ObjectId, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);

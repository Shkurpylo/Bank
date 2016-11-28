import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: {
    userId: {type: Schema.ObjectId, required: true},
    cardId: {type: Schema.ObjectId, required: true},
    cardNumber: { type: Number, required: true }
  },
  receiver: {
    userId: {type: Schema.ObjectId, required: true},
    cardId: {type: Schema.ObjectId, required: true},
    cardNumber: { type: Number, required: true }
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);

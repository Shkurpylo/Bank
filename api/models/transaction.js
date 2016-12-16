import mongoose from 'mongoose';
import { countBalance } from '../actions/transaction';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: {
    userId: { type: Schema.ObjectId, required: true },
    cardId: { type: Schema.ObjectId, required: true },
    cardNumber: { type: Number, required: true }
  },
  receiver: {
    userId: { type: Schema.ObjectId, required: true },
    cardId: { type: Schema.ObjectId, required: true },
    cardNumber: { type: Number, required: true }
  },
  message: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

TransactionSchema.pre('save', function(next) {
  const transaction = this;
  console.log('!!! in PRE: ' + JSON.stringify(this));

  countBalance(transaction.sender.cardId)
    .then(balance => {
      if (balance > transaction.amount) {
        return next();
      }
      const err = new Error('not enaugh balance');
      return next(err);
    });
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);

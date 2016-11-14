import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  from   : {type: Schema.ObjectId, required: true},
  to     : {type: Schema.ObjectId, required: true},
  amount : {type: Number, required: true},
  when   : {type: Date,   required: true}
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
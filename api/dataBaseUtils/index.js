import mongoose from "mongoose";

function setUpConnection() {
  mongoose.connect('mongodb://localhost/BankDB');
}

import * as user from './utils/userUtils';



import mongoose from 'mongoose';
import { Customer } from '../models';


export async function checkCustomerToken(token) { // get
  return new Promise((resolve, reject) => {
    Customer.findOne({ 'uuid': token })
      .then(res => {
        if (res) resolve(true);
        resolve(false);
      })
      .catch(err => reject(err));
  });
}

export function addCustomer(req) {
  const newCustomer = req.body;
  return new Promise((resolve, reject) => {
    const customer = new Customer({
      name: newCustomer.name,
      uuid: newCustomer.uuid,
      account: mongoose.Types.ObjectId(newCustomer.account), // eslint-disable-line new-cap
      cardId: mongoose.Types.ObjectId(newCustomer.cardId), // eslint-disable-line new-cap
      cardNumber: newCustomer.cardNumber
    });
    customer.save()
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}

export function getCustomerByToken(token) { // get
  return new Promise((resolve, reject) => {
    Customer.findOne({ 'uuid': token })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}

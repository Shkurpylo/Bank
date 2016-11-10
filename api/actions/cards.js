import mongoose from 'mongoose';
import generator from 'creditcard-generator';
import {Card, CardSchema} from '../models';
import {User} from '../models';


export function getAllCards() {
  return new Promise((resolve, reject) => {
    const cardsMap = [];
    const id = mongoose.Types.ObjectId("582361bc6281c1d2d18854a6");
    const user = User.findById(id);
    // user.cards.forEach(function(card) {
    //   cardsMap.push(card);
    // });

    resolve(user.find('cards'));
    reject('err');
  });
 // return (User.findById(id));
}

// export default deleteCard(cardID){
//
//
// }

export function addNewCard(type) {
  // return new Promise((resolve, reject) => {
    const id = mongoose.Types.ObjectId("582361bc6281c1d2d18854a6");
    const user = User.findById(id);
    const card = new Card({
      _id     : mongoose.Types.ObjectId(),
      number  : 44444,
      pin     : getPin(),
      cvv     : getCVV(),
      explDate: getExplDate(),
      owner   : id
    });
    console.log(card);
    user.cards.push(card);
  return(user.save());

    //resolve(user.cards.push(card));
    // resolve(user.save());
    // reject('err');
    // })
}

function numberGenerator(type) {
  console.log('start generator');
  if(type == 'VISA'){
    return generator.GenCC('VISA');
  } else {
    return generator.GenCC('Mastercard');
  }
}

function getPin() {
  return Math.floor(Math.random() * (10000 - 999)) + 999;
}

function getCVV() {
  return Math.floor(Math.random() * (1000 - 99)) + 99;
}

function getExplDate() {
  let now = new Date;
  return(new Date(now.getMonth(), now.getFullYear() + 3));
}


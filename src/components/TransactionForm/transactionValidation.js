import memoize from 'lru-memoize';
import {createValidator, required, maxLength, minLength, integer, isNumeric} from 'utils/validation';

const transactionValidation = createValidator({
  sender: [required],
  receiver: [required, integer, maxLength(16), minLength(16)],
  mess: [maxLength(40)],
  amount: [required, isNumeric]
});
export default memoize(10)(transactionValidation);

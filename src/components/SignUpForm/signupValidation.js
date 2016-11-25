import memoize from 'lru-memoize';
import {createValidator, required, maxLength, minLength, email, match} from 'utils/validation';

const signupValidation = createValidator({
  name: [required, maxLength(12)],
  lastName: [required, maxLength(15)],
  email: [required, email],
  pass: [required, maxLength(16), minLength(8)],
  confirmPass: [required, match(['pass'])]
});
export default memoize(10)(signupValidation);

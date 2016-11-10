import memoize from 'lru-memoize';
import {createValidator, required, maxLength, email} from 'utils/validation';

const surveyValidation = createValidator({
  name: [required, maxLength(12)],
  lastName: [required, maxLength(15)],
  email: [required, email],
  pass: [required, maxLength(15)],
  confirmPass: [required, maxLength(15)]
});
export default memoize(10)(surveyValidation);

import memoize from 'lru-memoize';
import {createValidator, maxLength} from 'utils/validation';

const renameValidation = createValidator({
  name: [maxLength(24)],
});
export default memoize(10)(renameValidation);

import memoize from 'lru-memoize';
import {createValidator, maxLength} from 'utils/validation';

const nameValidation = createValidator({
  cardName: [maxLength(24)],
});
export default memoize(10)(nameValidation);

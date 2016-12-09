export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      // console.log('middleware' + action);

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      // console.log('middleware: promise: ' + promise + ' types: ' + types + '...rest: ' + rest );

      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;

      // if (REQUEST === 'bank/auth/LOGOUT') {
      //   getState.next = undefined;
      // }

      next({...rest, type: REQUEST });

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS }),
        (error) => next({...rest, error, type: FAILURE })
      ).catch((error) => {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE });
      });

      return actionPromise;
    };
  };
}

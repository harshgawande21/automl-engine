const store = require('./frontend/src/store').default;
const { loginUser } = require('./frontend/src/store/authSlice');

(async () => {
  console.log('initial state', store.getState().auth);
  const action = await store.dispatch(loginUser({ email: 'admin@local', password: 'admin' }));
  console.log('action', action.type, action.payload || action.error);
  console.log('new state', store.getState().auth);
})();
import {configureStore} from '@reduxjs/toolkit';
import employeesReducer from './reducers/employeesReducer';
import appReducer from './reducers/appReducer';

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    app: appReducer,
    employees: employeesReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import AppHeaderReducer from './reducers/AppHeaderReducer';
import selectedSEReducer from './reducers/SelectedSEReducer'

export const store = configureStore({
  reducer: {
    selectedSEState: selectedSEReducer,
    appHeaderState: AppHeaderReducer,
  },
});
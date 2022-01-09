import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import { reducer as clientsReducer } from "./clients/clientSlice";

// Create rootreducer which combines every defined reducer
const rootReducer = combineReducers({
    clients: clientsReducer, // clients = value to be used in the useSelector
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk] // redux-thunk will intercept dispatches of actions to the store
});
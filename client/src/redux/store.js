import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./reducer";


const store = configureStore({
    reducer: rootReducer, // it not mandatory to combine reducer we can directly pass multiple reducer to reducer property as a object .
})

const {dispatch} = store;

export {store, dispatch};
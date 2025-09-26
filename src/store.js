import {configureStore} from '@reduxjs/toolkit'
import authReducer from './store/authSlice'
import loaderReducer from './store/loaderSlice'

export const store = configureStore({
    reducer: 
    {
        auth: authReducer,
        loader: loaderReducer,
    }
})


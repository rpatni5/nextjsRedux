import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './features/theme/themeSlice'
import authSlice from './features/auth/authSlice'
import userSlice from './features/user/userSlice'


export const createStore=() =>{
    return configureStore({
        reducer: {
         theme : themeSlice,
         auth : authSlice,
         users : userSlice
        }
      })
}


export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

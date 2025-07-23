import { configureStore } from '@reduxjs/toolkit'
import themeSlice from './features/theme/themeSlice'
import authSlice from './features/auth/authSlice'
import userSlice from './features/user/userSlice'
import screensSlice from './features/screens/screensSlice'
import { permission } from 'process'
import permissionSlice from './features/permissions/permissionSlice'


export const createStore=() =>{
    return configureStore({
        reducer: {
         theme : themeSlice,
         auth : authSlice,
         users : userSlice,
         screens : screensSlice,
         permission :permissionSlice,
        },
        devTools: process.env.NODE_ENV !== 'production',
      })
}


export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

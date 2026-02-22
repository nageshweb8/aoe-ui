import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { layoutSlice } from './slices/layoutSlice';

/**
 * Root reducer built with `combineSlices` — supports lazy injection
 * so feature modules can register their own slices without the shell
 * needing to import from `@modules/*`.
 *
 * Usage from a module:
 *   const vendorSlice = createSlice({ name: 'vendors', ... });
 *   rootReducer.inject(vendorSlice);
 */
export const rootReducer = combineSlices(layoutSlice);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

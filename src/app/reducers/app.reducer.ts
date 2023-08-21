import { createReducer, on } from '@ngrx/store';
import { setColorTheme, setBgTheme } from '../actions/app.actions'; // Đường dẫn đến các hành động
import { initialAppState } from '../states/app.state';

const _appReducer = createReducer(
  initialAppState,
  on(setColorTheme, (state, { newValue }) => ({ ...state, colorTheme: newValue })),
  on(setBgTheme, (state, { newValue }) => ({ ...state, bgTheme: newValue }))
);

export function appReducer(state, action) {
  return _appReducer(state, action);
}

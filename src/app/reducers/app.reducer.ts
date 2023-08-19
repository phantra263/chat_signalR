import { createReducer, on } from '@ngrx/store';
import { setVariable1, setVariable2 } from '../actions/app.actions'; // Đường dẫn đến các hành động
import { initialAppState } from '../states/app.state';

const _appReducer = createReducer(
  initialAppState,
  on(setVariable1, (state, { newValue }) => ({ ...state, colorTheme: newValue })),
  on(setVariable2, (state, { newValue }) => ({ ...state, bgTheme: newValue }))
);

export function appReducer(state, action) {
  return _appReducer(state, action);
}

import { createAction, props } from '@ngrx/store';

export const setColorTheme = createAction('[App] Set Variable 1', props<{ newValue: string }>());
export const setBgTheme = createAction('[App] Set Variable 2', props<{ newValue: string }>());
export const setFlagMenu = createAction('[App] Set Variable 3', props<{ newValue: boolean }>());

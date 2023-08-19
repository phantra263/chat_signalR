import { createAction, props } from '@ngrx/store';

export const setVariable1 = createAction('[App] Set Variable 1', props<{ newValue: string }>());
export const setVariable2 = createAction('[App] Set Variable 2', props<{ newValue: string }>());

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';

// Tạo selector để lấy trạng thái ứng dụng
export const selectAppState = createFeatureSelector<AppState>('app');

// Tạo selector để lấy dữ liệu từ trạng thái ứng dụng
export const selectVariable1  = createSelector(
  selectAppState,
  (state: AppState) => state.colorTheme
);

export const selectVariable2 = createSelector(
  selectAppState,
  (state: AppState) => state.bgTheme
);
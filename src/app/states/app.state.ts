export interface AppState {
  colorTheme: string;
  bgTheme: string;
  flagMenuOnSp: boolean
}

export const initialAppState: AppState = {
  colorTheme: '6E00FF',
  bgTheme: 'bg-theme01',
  flagMenuOnSp: false 
};

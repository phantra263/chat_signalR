import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getContrastingColors(): { background: string; text: string } {
    const background = this.getRandomColor();
    const text = this.getContrastingTextColor(background);
    return { background, text };
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  private getContrastingTextColor(backgroundColor: string): string {
    const r = parseInt(backgroundColor.slice(4, 7), 10);
    const g = parseInt(backgroundColor.slice(9, 12), 10);
    const b = parseInt(backgroundColor.slice(14, 17), 10);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  getUserStyles() {
    const obj = this.getContrastingColors();
    return {
      'background-color': obj.background,
      'color': obj.text,
    };
  }
}

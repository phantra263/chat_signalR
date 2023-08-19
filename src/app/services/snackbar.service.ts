import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  show(type: string, message: string) {
    const snackbar = document.createElement('div');
    snackbar.className = 'custom-snackbar';
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    switch(type) {
      case "error":
        snackbar.classList.add('error');
        break;
      case "warning":
        snackbar.classList.add('warning');
        break;
      case "success":
        snackbar.classList.add('success');
        break;
    }

    
    setTimeout(() => {
      snackbar.classList.add('snackbar-hidden');
      setTimeout(() => {
        document.body.removeChild(snackbar);
      }, 300); // Wait for CSS transition
    }, 3000);
  }
}
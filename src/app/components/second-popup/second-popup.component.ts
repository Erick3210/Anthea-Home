import { Component } from '@angular/core';

@Component({
  selector: 'app-second-popup',
  standalone: true,
  templateUrl: './second-popup.component.html',
  styleUrls: ['./second-popup.component.scss'],
})
export class SecondPopupComponent {
  
  // Método para cerrar el popup
  onClose() {
    const popup = document.querySelector('.second-popup');
    if (popup) {
      popup.classList.add('hide'); // Aplicar la clase "hide" para ocultar el popup
    }
  }
}

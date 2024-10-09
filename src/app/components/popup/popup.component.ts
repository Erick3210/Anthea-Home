import { AfterViewInit, Component } from '@angular/core';
import { AppComponent } from '../../app.component'; // Ruta corregida

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements AfterViewInit {
  constructor(private appComponent: AppComponent) {} // Inyecta el AppComponent

  ngAfterViewInit(): void {
    setTimeout(() => {
      const popup247 = document.querySelector('.aviso-nom247');
      popup247?.classList.remove('hide'); // Mostrar el popup después de 1 segundo
    }, 1000);
  }

  onClose() {
    const popup247 = document.querySelector('.aviso-nom247');
    popup247?.classList.add('hide');
  }

  // Método para manejar el clic en el enlace y abrir el segundo popup sin cambiar de ruta
  openSecondPopup(event: Event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    const popup247 = document.querySelector('.aviso-nom247');
    popup247?.classList.add('hide'); // Ocultar el primer popup
    this.appComponent.openSecondPopup(); // Llamar al método para mostrar el segundo popup
  }
}

import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';  // Importa CommonModule para utilizar *ngIf

import { FormComponent } from './components/form/form.component';
import { PopupComponent } from './components/popup/popup.component';
import { PromoModalComponent } from './components/promo-modal/promo-modal.component';
import { ModalGalleryComponent } from './components/modal-gallery/modal-gallery.component';
import { FolletoModalComponent } from './components/folleto-modal/folleto-modal.component';
import { WhatsappFormComponent } from './components/whatsapp-form/whatsapp-form.component';
import { SecondPopupComponent } from './components/second-popup/second-popup.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Importa CommonModule para *ngIf y otras directivas comunes
    RouterOutlet,
    FormComponent,
    PopupComponent,
    PromoModalComponent,
    ModalGalleryComponent,
    FolletoModalComponent,
    WhatsappFormComponent,
    SecondPopupComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements AfterViewInit, AfterContentChecked {
  private observer: IntersectionObserver | null = null;

  isFirstPopupVisible: boolean = true;  // El primer popup se muestra por defecto
  isSecondPopupVisible: boolean = false; // El segundo popup está oculto por defecto

  constructor(private router: Router) {}

  ngAfterViewInit() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 123) {
        e.preventDefault();
      }
    });

    this.setupObserver();

    // Observa imágenes y animaciones al cambiar de ruta
    this.router.events.subscribe(() => {
      this.observeElements();
    });
    this.observeElements();
  }

  // Este método asegura que el observador se aplique incluso si las imágenes y animaciones aparecen dinámicamente
  ngAfterContentChecked() {
    if (this.observer) {
      this.observeElements();
    }
    this.observeElements();
  }

  // Configura el IntersectionObserver
  setupObserver() {
    let baseHref = document.querySelector('base')?.getAttribute('href') || '/';

    if (baseHref === '/') {
      baseHref = '';
    }

    const config = {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;

          // Carga de imágenes
          if (element.tagName === 'IMG' && element.hasAttribute('data-src')) {
            this.loadImage(element as HTMLImageElement, baseHref);
          }

          // Animaciones
          if (element.hasAttribute('data-animate')) {
            this.animateElement(element);
          }

          self.unobserve(element); // Dejar de observar el elemento después de su manipulación
        }
      });
    }, config);

    // Inicializar observación de imágenes y animaciones
    this.observeElements();
  }

  // Método para cargar la imagen diferida
  loadImage(img: HTMLImageElement, baseHref: string) {
    let dataSrc: string = '';
    //@ts-ignore
    const url = img.dataset?.src || img.src || '/';
    dataSrc = url.replace(/^https?:\/\/[^\/]+/, '');

    if (dataSrc.startsWith(baseHref)) {
      dataSrc = dataSrc.replace(new RegExp('^' + baseHref), '');
    }

    if (dataSrc) {
      img.setAttribute('src', `${baseHref}${dataSrc}`);
      img.onload = () => img.classList.add('loaded');
      img.removeAttribute('data-src');
    }
  }

  // Método para aplicar la animación
  animateElement(element: HTMLElement) {
    const animationClass = element.getAttribute('data-animate') || '';
    element.classList.add('animate__animated', animationClass);
  }

  // Observa imágenes con 'data-src' y elementos con 'data-animate'
  observeElements() {
    if (this.observer) {
      // Observa imágenes
      document.querySelectorAll('[data-src]').forEach((img) => this.observer!.observe(img));

      // Observa elementos con animación
      document.querySelectorAll('[data-animate]').forEach((el) => this.observer!.observe(el));
    }
  }

    // Método para abrir el segundo popup
    openSecondPopup() {
      this.isFirstPopupVisible = false; // Ocultar el primer popup
      this.isSecondPopupVisible = true; // Mostrar el segundo popup
      console.log('Segundo popup abierto');  // Verificar que este mensaje aparezca
    }
  
    // Método para cerrar el segundo popup
    closeSecondPopup() {
      this.isSecondPopupVisible = false; // Ocultar el segundo popup
    }
  
  
}

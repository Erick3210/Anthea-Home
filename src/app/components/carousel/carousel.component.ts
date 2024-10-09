import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'], // Cambia styleUrl a styleUrls
})
export class CarouselComponent {
  images = [
    'assets/images/test.jpg',
    'assets/images/1.png',
    'assets/images/2.png',
    'assets/images/3.png',
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }

  showImage(index: number) {
    this.currentIndex = index;
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

    // Nuevo método para abrir la galería
    openGallery() {
      // Aquí llamas a la función que abre el modal de la galería
      const galleryElement = document.getElementById('uiGallery');
      if (galleryElement) {
        galleryElement.classList.add('show'); // Muestra la galería
      }
    }
}

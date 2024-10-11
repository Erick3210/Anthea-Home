import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
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

  // Función para el auto deslizamiento
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

  // Método para avanzar a la siguiente imagen
  forward() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  // Método para retroceder a la imagen anterior
  backward() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  openGallery() {
    const galleryElement = document.getElementById('uiGallery');
    if (galleryElement) {
      galleryElement.classList.add('show');
    }
  }
}

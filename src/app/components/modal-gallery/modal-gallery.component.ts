import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal-gallery',
  standalone: true,
  templateUrl: './modal-gallery.component.html',
  styleUrls: ['./modal-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalGalleryComponent implements AfterViewInit {
  gallerySlider!: Element | null;
  uiGallery!: HTMLElement | null;
  next!: Element | null | undefined;
  prev!: Element | null | undefined;
  count = 0;
  pictures!: NodeListOf<HTMLPictureElement>;

  ngAfterViewInit(): void {
    this.gallerySlider = document.querySelector('.gallery-slider');
    this.uiGallery = document.getElementById('uiGallery');
    this.next = this.uiGallery?.querySelector('#nextBtn');
    this.prev = this.uiGallery?.querySelector('#prevBtn');
    this.pictures = this.gallerySlider?.querySelectorAll('picture') as NodeListOf<HTMLPictureElement>;

    if (this.pictures.length > 1) {
      (this.next as HTMLDivElement).style.display = 'inline-flex';
      (this.prev as HTMLDivElement).style.display = 'inline-flex';
    } else {
      (this.next as HTMLDivElement).style.display = 'none';
      (this.prev as HTMLDivElement).style.display = 'none';
    }
  }

  openGallery() {
    this.uiGallery?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.uiGallery?.classList.remove('show');
    document.body.style.overflowY = 'auto';
  }

  forward() {
    if (!this.pictures || this.pictures.length === 0) {
      console.error('No hay imágenes en la galería para avanzar.');
      return;
    }

    this.count = (this.count + 1) % this.pictures.length;
    this.updateGallery();
  }

  back() {
    if (!this.pictures || this.pictures.length === 0) {
      console.error('No hay imágenes en la galería para retroceder.');
      return;
    }

    this.count = (this.count - 1 + this.pictures.length) % this.pictures.length;
    this.updateGallery();
  }

  updateGallery() {
    if (!this.pictures || this.pictures.length === 0) {
      console.error('No hay imágenes en la galería para actualizar.');
      return;
    }
  
    this.pictures.forEach((picture, index) => {
      if (index === this.count) {
        picture.classList.add('active');
      } else {
        picture.classList.remove('active');
      }
    });
  
    // Mover el slider de izquierda a derecha basado en el índice actual
    (this.gallerySlider as HTMLDivElement).style.marginLeft = `-${this.count * 100}%`;
  }
  
}

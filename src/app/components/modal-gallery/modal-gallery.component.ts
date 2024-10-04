import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal-gallery',
  standalone: true,
  imports: [],
  templateUrl: './modal-gallery.component.html',
  styleUrl: './modal-gallery.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalGalleryComponent implements AfterViewInit {
  handlers!: NodeListOf<Element>;
  gallerySlider!: Element | null;
  uiGallery!: HTMLElement | null;
  next!: Element | null | undefined;
  prev!: Element | null | undefined;
  count = 0;
  limit!: number;
  pictures!: NodeListOf<HTMLPictureElement>;
  stylePicture =
    'display:flex;align-items:center;justify-content:center;width:100%;height:calc(100vh - 100px);';
  stylePictureNoActive =
    'opacity: 0.2;transform: scale(0.7);transition: all 200ms ease-out;user-select: none;overflow: hidden;';
  stylePictureActive =
    'opacity: 1;transform: scale(1);transition: all 200ms ease-in;';

  ngAfterViewInit(): void {
    this.handlers = document.querySelectorAll('.button-open-gallery');
    this.gallerySlider = document.querySelector('.gallery-slider');
    this.uiGallery = document.getElementById('uiGallery');
    this.next = this.uiGallery?.querySelector('#nextBtn');
    this.prev = this.uiGallery?.querySelector('#prevBtn');

    console.log(this.handlers);
    this.handlers.forEach((handler: any) => {
      const self = this;
      handler.addEventListener('click', async function () {
        console.log(event);
        const typeGallery = handler?.dataset?.gallery || null;

        console.log(typeGallery);

        if (typeGallery) {
          const response = await fetch(
            `assets/galleryDataSet/${typeGallery}Gallery.json`
          );
          const gallery = await response.json();
          console.log(gallery);
          self.limit = gallery.images.length;
          self.createGallery(gallery.images);
        }
      });
    });
  }

  close() {
    this.uiGallery?.classList.remove('show');
    document.body.style.overflowY = 'auto';
    this.count = 0;
    (this.gallerySlider as HTMLDivElement).innerHTML = '';
  }

  async createGallery(images: string[]) {
    const renderGallery = await this.renderSlide(images);

    if (renderGallery) {
      (this.gallerySlider as HTMLDivElement).style.marginLeft = `0`;
      this.uiGallery?.classList.add('show');
      document.body.style.overflow = 'hidden';
      this.initSliderEvents();
    }
  }

  async renderSlide(images: string[]) {
    return new Promise((resolve, reject) => {
      const limit = images.length;

      let elements = '';
      images.forEach((image, index) => {
        elements += `
          <picture data-index=${index} style=${this.stylePicture}>
              <img loading="lazy" class="loaded" data-src="${image}" style='object-fit: contain;width: 95%;height: 95%;border-radius: 20px;user-select: none;' alt="preview image">
          </picture>
        `;
      });

      (this.gallerySlider as HTMLDivElement).innerHTML = elements;
      (this.gallerySlider as HTMLDivElement).style.minWidth = `${limit}00%`;

      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }

  initSliderEvents() {
    this.pictures = this.uiGallery?.querySelectorAll(
      'picture'
    ) as NodeListOf<HTMLPictureElement>;
    this.uiGallery?.querySelector('picture')?.classList.add('active');

    if (this.pictures.length > 1) {
      (this.next as HTMLDivElement).style.display = 'none';
      (this.prev as HTMLDivElement).style.display = 'inline-flex';
    } else {
      (this.next as HTMLDivElement).style.display = 'none';
      (this.prev as HTMLDivElement).style.display = 'none';
    }
  }

  forward() {
    this.count = this.count - 1 > 0 ? this.count - 1 : 0;
    this.updateGallery();
  }

  back() {
    this.count = this.count + 1 < this.limit ? this.count + 1 : this.limit - 1;
    this.updateGallery();
  }

  updateGallery() {
    this.pictures.forEach((picture) => {
      let numb = Number(picture.dataset?.['index']);
      if (numb === this.count) {
        picture.classList.add('active');
      } else {
        picture.classList.remove('active');
      }

      (
        this.gallerySlider as HTMLDivElement
      ).style.marginLeft = `-${this.count}00%`;

      this.count === 0 &&
        ((this.next as HTMLDivElement).style.display = 'none');
      this.count !== 0 &&
        ((this.next as HTMLDivElement).style.display = 'inline-flex');
      this.count === this.pictures.length - 1 &&
        ((this.prev as HTMLDivElement).style.display = 'none');
      this.count !== this.pictures.length - 1 &&
        ((this.prev as HTMLDivElement).style.display = 'inline-flex');
    });
  }
}

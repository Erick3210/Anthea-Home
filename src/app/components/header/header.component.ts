import { AfterViewInit, Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], // Cambio aquí: styleUrls en lugar de styleUrl
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements AfterViewInit {
  menu!: HTMLElement | null;
  menuIcon!: HTMLImageElement | null;
  show: boolean = false;
  iconMenu!: HTMLElement | null;
  iconClose!: HTMLElement | null;

  ngAfterViewInit(): void {
  }

  public showMenu() {
    this.show = !this.show;
    this.iconMenu = document.querySelector('#icon-menu');
    this.iconClose = document.querySelector('#icon-close');
    this.menu = document.querySelector('#menu-mobile');

    if (this.show) {
      this.iconMenu?.classList.add('hiddenIcon');
      this.iconClose?.classList.remove('hiddenIcon');
      this.menu?.classList.remove('hiddenIcon');
    } else {
      this.iconMenu?.classList.remove('hiddenIcon');
      this.iconClose?.classList.add('hiddenIcon');
      this.menu?.classList.add('hiddenIcon');
    }
  }

  // Detecta el scroll para cambiar el color del header
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) { // Cambia de color después de 50px de scroll
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}

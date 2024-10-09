import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from './../../components/footer/footer.component';
import { FolletoModalComponent } from '../../components/folleto-modal/folleto-modal.component';
import { CarouselComponent } from '../../components/carousel/carousel.component'; // Cambio en el nombre

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FolletoModalComponent, CarouselComponent], // Cambio en el nombre del componente
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // Cambio a styleUrls en plural
})
export class HomeComponent {}

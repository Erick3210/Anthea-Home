import { AfterViewInit, Component } from '@angular/core';
import {
  ZohoRequest,
  ZohoService,
  UTMInterface,
} from '../../services/zoho.service';
import { FormService } from '../../services/form.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [ZohoService, FormService],
})
export class FormComponent implements AfterViewInit {
  elements!: NodeListOf<HTMLElement>;
  handlers!: NodeListOf<HTMLElement>;
  headerForm!: HTMLElement | null;
  errorForm!: boolean;
  showAllForm!: boolean;
  showForm!: boolean;
  isFooter: boolean = false;

  isCliked = false;
  message = 'QUIERO MÁS INFORMACIÓN';

  templateForm: ZohoRequest = {
    SingleLine: '',
    SingleLine1: '',
    PhoneNumber1_countrycode: '',
    Email: '',
    MultiLine: '',
    Dropdown1: 'Saltillo',
    Dropdown: 'Portal de las Lomas 2A Secc.',
    Dropdown2: 'INTERNET MKT',
    Dropdown3: 'PÁGINA WEB',
    Dropdown5: 'Landing',
    SingleLine4: 'Landing Saltillo',
    SingleLine5: 'Por llamar',
    SingleLine2: 'SubCampaña',
    zf_referrer_name: '',
    zf_redirect_url: '',
    zc_gad: '',
  };

  requiredData: string[] = [
    'SingleLine',
    'SingleLine1',
    'PhoneNumber1_countrycode',
    'Email',
    'MultiLine',
  ];

  constructor(private zohoApi: ZohoService, private landingApi: FormService) {}

  setStaticFooter(show: boolean) {
    if (window.screenX < 1024) {
      show && this.headerForm?.classList.add('static-footer');
      !show && this.headerForm?.classList.remove('static-footer');
    }
  }

  ngAfterViewInit(): void {
    this.showForm = false;
    this.elements = document.querySelectorAll('.base-form');
    this.headerForm = document.getElementById('headerForm');
    this.handlers = document.querySelectorAll('.open-form');
    this.scrollhide();

    !!this.handlers.length &&
      this.handlers.forEach((handler) => {
        handler.addEventListener('click', () => {
          this.openForm(handler.classList.contains('all'));
        });
      });

    window.addEventListener('scroll', () => {
      this.scrollhide();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            this.headerForm?.classList.add('collapsed');
            this.showForm = false;
            this.showAllForm = false;
            this.setStaticFooter(false);
            return;
          }

          this.setStaticFooter(true);

          if (entry.boundingClientRect.width > 1024) {
            if (entry.target.className.includes('footer')) {
              this.isFooter = true;
              this.headerForm?.classList.add('footer');
              this.showAllForm = true;
              this.showForm = true;
            } else {
              this.headerForm?.classList.remove('footer');
              this.showAllForm = false;
            }
          } else {
            this.showForm = false;
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(this.elements[1]);
    observer.observe(this.elements[0]);
  }
  scrollhide() {
    window.scrollY < 600 && (this.showAllForm = false);
    window.scrollY > 600 && (this.showAllForm = true);
  }

  openForm(all: boolean = false) {
    this.setStaticFooter(true);

    if (all) {
      this.showAllForm = true;
      this.showForm = true;
    } else {
      this.showForm = true;
    }
  }

  close() {
    this.showForm = false;
    this.showAllForm = false;
    this.setStaticFooter(false);
  }

  submit() {
    let visitorinfo = {};
    const formData: ZohoRequest = this.templateForm;
    const utms: UTMInterface = this.zohoApi.getUTMParams(window.location.href);

    if (utms.hasOwnProperty('utm_source')) {
      formData.SingleLine3 = utms.utm_source;
    }
    if (utms.hasOwnProperty('utm_campaign')) {
      formData.SingleLine6 = utms.utm_campaign;
    }
    if (utms.hasOwnProperty('utm_content')) {
      formData.SingleLine7 = utms.utm_content;
    }

    const isValid: boolean = this.zohoApi.validateForm(
      formData,
      this.requiredData
    );

    if (!isValid) {
      this.errorForm = true;
      return;
    }

    visitorinfo = {
      ...visitorinfo,
      contactnumber: formData.PhoneNumber1_countrycode,
      name: formData.SingleLine,
      email: formData.Email,
    };

    this.landingApi
      .save({ ...formData, form_type: 'contacto' })
      .subscribe(() => {
        this.close();

        this.templateForm = {
          ...this.templateForm,
          SingleLine: '',
          SingleLine1: '',
          Email: '',
          PhoneNumber1_countrycode: '',
          MultiLine1: '',
        };

        this.zohoApi.send(formData).subscribe(() => {
          console.log('send success zoho data');
        });
      });

    parent.postMessage(
      JSON.stringify({
        type: 'zoho.salesiq.apimessage',
        visitor: visitorinfo,
      }),
      '*'
    );
  }
}

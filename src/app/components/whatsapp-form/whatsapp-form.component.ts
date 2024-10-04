import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../services/form.service';
import {
  UTMInterface,
  ZohoRequest,
  ZohoService,
} from '../../services/zoho.service';

@Component({
  selector: 'app-whatsapp-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-form.component.html',
  styleUrl: './whatsapp-form.component.scss',
  providers: [FormService],
})
export class WhatsappFormComponent {
  modal!: HTMLDialogElement | null;
  errorForm: boolean = false;

  templateForm: ZohoRequest = {
    SingleLine: '',
    SingleLine1: '',
    PhoneNumber1_countrycode: '',
    Email: 'anonymous@ruba.com.mx',
    MultiLine: 'Quiero más información de portal de las lomas',
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
    'PhoneNumber1_countrycode',
    'SingleLine1',
  ];

  constructor(public landingApi: FormService, public zohoApi: ZohoService) {}

  ngAfterViewInit(): void {
    this.modal = document.querySelector('#whatapp');
    const handles = document.querySelectorAll('.whatappForm');
    handles.forEach((button) => {
      button.addEventListener('click', () => {
        document.body.classList.add('overflowHide');
        this.modal?.classList.remove('hidden');
        this.modal?.showModal();
      });
    });

    this.modal?.querySelector('button.close')?.addEventListener('click', () => {
      document.body.classList.remove('overflowHide');
      this.modal?.classList.add('hidden');
      this.modal?.close();
    });
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

    console.log('submitted :: isValid :: ' + isValid);

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

    this.zohoApi.send(formData).subscribe(() => {
      console.log('send success zoho data');
    });

    this.landingApi
      .save({ ...formData, form_type: 'whatsapp' })
      .subscribe(() => {
        this.templateForm = {
          ...this.templateForm,
          SingleLine: '',
          Email: '',
          PhoneNumber1_countrycode: '',
        };

        this.modal?.close();
        const message = `Hola mi nombre es ${formData.SingleLine}, ${formData.MultiLine}`;
        const url = `https://wa.me/+528448691210?text=${message}`;
        window.open(url, '_blank', 'width=600,height=400,scrollbars=yes');
      });

    parent.postMessage(
      JSON.stringify({
        type: 'zoho.salesiq.apimessage',
        visitor: visitorinfo,
      }),
      '*'
    );

    this.modal?.classList.add('hidden');
    this.modal?.close();
  }
}

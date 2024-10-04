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
  selector: 'app-folleto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './folleto-modal.component.html',
  styleUrl: './folleto-modal.component.scss',
  providers: [FormService],
})
export class FolletoModalComponent implements AfterViewInit {
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
    this.modal = document.querySelector('dialog#folleto');
    const handle = document.querySelector('button.folleto');
    handle?.addEventListener('click', () => {
      this.modal?.classList.remove('hidden');
      this.modal?.showModal();
    });

    this.modal?.querySelector('button.close')?.addEventListener('click', () => {
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
      .directSave({ ...formData, form_type: 'brochure' })
      .subscribe(() => {
        this.templateForm = {
          ...this.templateForm,
          SingleLine: '',
          SingleLine1: '',
          PhoneNumber1_countrycode: '',
        };

        const url = '/portal-de-las-lomas/assets/brochure.pdf';
        const anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', 'brochure portal de las lomas.pdf');
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        this.modal?.close();
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

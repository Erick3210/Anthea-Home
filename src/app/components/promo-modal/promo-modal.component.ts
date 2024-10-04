import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-promo-modal',
  standalone: true,
  imports: [],
  templateUrl: './promo-modal.component.html',
  styleUrl: './promo-modal.component.scss'
})
export class PromoModalComponent implements AfterViewInit {
  modal!:HTMLDialogElement | null
  visible = false
  ngAfterViewInit(): void {
    this.modal = document.querySelector('dialog#promo')

    const handle = document.querySelector('#modelos-page')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting && !this.visible){
            this.modal?.classList.remove('hidden')
            this.modal?.showModal()
            this.visible = true
          }
        })
      },{ threshold: 0.01 }
    )

    observer.observe(handle!)


    const buttonOpen = document.querySelector('a.promo') as HTMLAnchorElement
    buttonOpen.addEventListener('click', () => {
      this.modal?.classList.remove('hidden')
      this.modal?.showModal()
      this.visible = true
    })

  }

  onClose(){
    this.modal?.classList.add('hidden')
    this.modal?.close()
  }

  agendarCita(){
    window.scroll({
      top: 0,
      behavior: "smooth",
    })

    this.onClose()
  }
}

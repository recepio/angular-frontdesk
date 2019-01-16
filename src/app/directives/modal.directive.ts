import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import { ModalService } from '../services/modal.service';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective implements OnInit, OnDestroy {

  @Input() id: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void{
      let modal = this;

      if (!this.id) {
          console.error('modal must have an id');
          return;
      }

      document.body.appendChild(this.element);
      this.element.addEventListener('click', function (e: any) {
          if (e.target.className === 'modal') {
              modal.close();
          }
      });
      this.modalService.add(this);
  }

  ngOnDestroy(){
      this.modalService.remove(this.id);
      this.element.remove();
  }

  open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('modal-open');
  }

  close(): void {
      this.element.style.display = 'none';
      document.body.classList.remove('modal-open');
  }
}

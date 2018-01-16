import {
  AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, HostBinding,
  HostListener, OnChanges, OnInit, Renderer, SimpleChanges, ViewChild, ViewContainerRef
} from '@angular/core';

import { DialogService } from '../dialog.service';

interface DialogPolyFill {
  registerDialog(element: any);
}

declare var dialogPolyfill: DialogPolyFill;

@Component({
  selector: 'app-dialog-wrapper',
  template: '<div #target></div>',
  styleUrls: ['./dialog-wrapper.component.scss']
})
export class DialogWrapperComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('target', {read: ViewContainerRef}) target;

  private componentRef: ComponentRef<any>;

  private viewInitialized = false;

  @HostBinding('class.in') visibleAnimate = false;
  @HostBinding('class.inactive') inactive = false;

  @HostListener('transitionend', ['$event']) onTransitionEnd(evt: TransitionEvent) {
    console.log('transitionend');
    if (!this.visibleAnimate) {
      // this.visible = false;
      this.el.nativeElement.close();
      this.destroyComponent();
    }
  }

  @HostListener('cancel', ['$event']) onCancel(evt: Event) {
    console.log('onCancel');
    evt.preventDefault();
    this.hide();
  }

  @HostListener('focusin', ['$event']) onFocusIn(evt: FocusEvent) {
    console.log('onFocusIn');
    this.inactive = false;
  }

  @HostListener('focusout', ['$event']) onFocusOut(evt: FocusEvent) {
    console.log('onFocusOut');
    this.inactive = true;
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  initComponent(type: any, data: Map<string, any>) {
    console.log('initComponent');

    if (!this.viewInitialized) {
      return;
    }

    if (this.componentRef) {
      this.destroyComponent();
    }

    const factory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(type);
    const injector = this.viewContainerRef.injector;
    this.componentRef = this.target.createComponent(factory, 0, injector);
    data.forEach((item, key) => this.componentRef.instance[key] = item);

    const dialogElement = this.el.nativeElement;

    if (!dialogElement.showModal) {
      dialogPolyfill.registerDialog(dialogElement);
    }

    this.renderer.invokeElementMethod(dialogElement, 'showModal');
    setTimeout(() => this.visibleAnimate = true, 0);
  }

  private destroyComponent() {
    console.log('destroyComponent');
    this.componentRef.destroy();
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.dialogService.showModal$.subscribe(({ component, data }) => {
      this.initComponent(component, data);
    });

    this.dialogService.hideModal$.subscribe(() => {

    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.viewInitialized = true;
    // this.initComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    // this.initComponent();
  }

  private hide(): void {
    console.log('hide');
    this.visibleAnimate = false;
  }

}

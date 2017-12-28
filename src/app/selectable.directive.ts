import { Directive, HostBinding, HostListener, Injector, Input, OnInit } from '@angular/core';

import { Item } from './item';
import { SelectionService } from './selection.service';

@Directive({
  selector: '[appSelectable]'
})
export class SelectableDirective implements OnInit {
  private collectionService: any;
  private selectionService: SelectionService;

  @Input('appSelectable') use: string;

  @Input() item: Item;

  @HostBinding('attr.tabindex') tabindex = '0';

  @HostBinding('class.selected')
  public get getSelected() {
    return this.selectionService.selected.includes(this.item);
  }

  @HostBinding('class.current')
  public get getCurrent() {
    return this.selectionService.current === this.item;
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    if (!evt.ctrlKey && !evt.metaKey) {
      this.selectionService.clear();
    }
    if (evt.shiftKey) {
      const beginPosition = this.collectionService.items.indexOf(this.selectionService.current);
      const endPosition = this.collectionService.items.indexOf(this.item);
      console.log(beginPosition, endPosition);
      for (let i = Math.min(beginPosition, endPosition); i <= Math.max(beginPosition, endPosition); i++) {
        this.selectionService.select(this.collectionService.items[i], false);
      }
    }
    this.selectionService.select(this.item, false);
  }

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.selectionService = this.injector.get(this.use + 'SelectionService');
    this.collectionService = this.injector.get(this.use + 'Service');
  }

}

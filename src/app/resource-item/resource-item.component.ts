import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { Resource } from '../resource';
import { SelectionService } from '../selection.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.scss']
})
export class ResourceItemComponent implements OnInit {

  @Input() resource: Resource;

  @HostBinding('attr.tabindex') tabindex = '0';
  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    if (!evt.ctrlKey && !evt.metaKey) {
      this.selectionService.clear();
    }
    if (evt.shiftKey) {
      const beginPosition = this.resourceService.items.indexOf(this.selectionService.current);
      const endPosition = this.resourceService.items.indexOf(this.resource);
      console.log(beginPosition, endPosition);
      for (let i = Math.min(beginPosition, endPosition); i <= Math.max(beginPosition, endPosition); i++) {
        this.selectionService.select(this.resourceService.items[i], false);
      }
    }
    this.selectionService.select(this.resource, false);
  }

  constructor(
    public resourceService: ResourceService,
    public selectionService: SelectionService
  ) { }

  ngOnInit() {
  }

  delete(resource: Resource): void {
    this.resourceService.delete(resource).subscribe();
  }
}

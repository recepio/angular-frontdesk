import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';

import { Area } from '../area';
import { AreaService } from '../area.service';

@Component({
  selector: 'app-area-item',
  templateUrl: './area-item.component.html',
  styleUrls: ['./area-item.component.scss']
})
export class AreaItemComponent implements OnInit {

  editing: boolean;
  oldName: string;

  @Input() area: Area;

  @HostListener('dblclick', ['$event']) onDblClick(evt: MouseEvent) {
    this.oldName = this.area.name;
    this.editing = true;
  }

  constructor(@Inject('areaService') public areaService: AreaService) { }

  ngOnInit() {
  }

  updateEditing() {
    this.editing = false;

    if (this.area.name.length === 0) {
      return this.areaService.delete(this.area);
    }

    return this.areaService.update(this.area);
  }

}

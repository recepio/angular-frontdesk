import { Component, HostListener, Inject, OnInit } from '@angular/core';

import { AreaService } from '../area.service';
import { Area } from '../area';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  editing = false;
  oldServiceName: string;
  oldDescription: string;

  @HostListener('document:click', ['$event']) clickedOutside(evt: MouseEvent) {
    this.areaService.update(this.areaSelectionService.current);
    this.editing = false;
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('keyup.escape', ['$event']) onEsc(evt: KeyboardEvent) {
    this.editing = false;
    this.areaSelectionService.current.serviceName = this.oldServiceName;
    this.areaSelectionService.current.description = this.oldDescription;
  }

  constructor(
    @Inject('areaService') public areaService: AreaService,
    @Inject('areaSelectionService') public areaSelectionService: SelectionService
  ) { }

  ngOnInit() {
  }

  trackByAreas(index: number, area: Area): string { return area.id; }

  add() {
    const area = new Area(this.areaService);
    this.areaService.add(area);
  }

  areaDropped(evt: any, area: Area, index: number) {
    this.areaSelectionService.select(area);
    if (index < area.order) {
      const to = area.order;
      area.order = -1;
      this.areaService.update(area);
      for (let i = to; i >= index; i--) {
        const a = this.areaService.items[i];
        a.order = i;
        this.areaService.update(a);
      }
    } else {
      const from = area.order;
      area.order = -1;
      this.areaService.update(area);
      for (let i = from; i <= index; i++) {
        const a = this.areaService.items[i];
        a.order = i;
        this.areaService.update(a);
      }
    }
  }

  startEdit() {
    this.editing = true;
    this.oldServiceName = this.areaSelectionService.current.serviceName;
    this.oldDescription = this.areaSelectionService.current.description;
  }

}

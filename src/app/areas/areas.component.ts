import {Component, Inject, OnInit} from '@angular/core';

import { AreaService } from '../area.service';
import { AreaFormComponent } from '../area-form/area-form.component';
import { Area } from '../area';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  constructor(
    @Inject('areaService') public areaService: AreaService,
    @Inject('areaSelectionService') public areaSelectionService: SelectionService
  ) { }

  ngOnInit() {
  }

  trackByAreas(index: number, area: Area): string { return area.id; }

  add() {
    const area = new Area(this.areaService);
    console.log(area);

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

}

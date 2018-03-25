import { Component, Inject } from '@angular/core';

import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  constructor(@Inject('areaSelectionService') public areaSelectionService: SelectionService) { }

}

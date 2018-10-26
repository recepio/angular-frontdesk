import { Component, Input, OnInit, Inject } from '@angular/core';

import { Resource } from '../resource';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.scss']
})
export class ResourceItemComponent implements OnInit {

  @Input() resource: Resource;

  constructor(
    @Inject('resourceService') private resourceService: ResourceService
  ) { }

  ngOnInit() {
  }

  remove(resource: Resource): void {
    this.resourceService.remove(resource);
  }
}

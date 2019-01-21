import { Component, Input, OnInit, Inject } from '@angular/core';

import { Resource } from '../resource';
import { ResourceService } from '../resource.service';
import {ModalService} from '../services/modal.service';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.scss']
})
export class ResourceItemComponent implements OnInit {

  @Input() resource: Resource;
  modalId: string;

  constructor(
    @Inject('resourceService') private resourceService: ResourceService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  remove(resource: Resource): void {
    this.resourceService.remove(resource);
  }

  openModal(id: string) {
      this.modalId = id;
      this.modalService.open(id, (this.resource as any));
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
}

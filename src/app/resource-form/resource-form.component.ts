import {Component, Inject, Input, OnInit} from '@angular/core';
import {ModalService} from '../services/modal.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from '../store';
import {SelectionService} from '../selection.service';
import {WorkSpaceDescriptionService} from '../services/work-space-description.service';
import {AddArea, AddResource} from '../store/actions/workspace.actions';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class ResourceFormComponent implements OnInit {
  @Input() companyId: string;
  modalId: string;
  resourceForm: FormGroup;
  resourceNamelCtrl: FormControl;
  resourceDescriptionCtrl: FormControl;
  resourceInstancesCtrl: FormControl;
  resourceBookingCapacityIndexCtrl: FormControl;
  resourceAreaIdCtrl: FormControl;
  areaId: number;
  getState: Observable<any>;

  constructor(
      @Inject('areaSelectionService') public areaSelectionService: SelectionService,
      private  _descriptionService: WorkSpaceDescriptionService,
      private modalService: ModalService,
      private  fb: FormBuilder,
      private store: Store<AppState>
  ) {
      this.getState = this.store.select(selectAuthState);
      this.areaSelectionService.currentChanged$.subscribe(
          (data) => {
                  if((data as any).select){
                      this.areaId = (data as any).item.id;
                      this.resourceAreaIdCtrl.setValue(this.areaId);
                  }
              }, () => {}, () => {}
      )
      this.initialiseForms();
  }

  ngOnInit() {
  }

  private initialiseForms() {
      this.areaId = this.areaSelectionService.current.id;
      this.resourceNamelCtrl = this.fb.control('', Validators.required);
      this.resourceDescriptionCtrl = this.fb.control('', Validators.required);
      this.resourceInstancesCtrl = this.fb.control('', Validators.required);
      this.resourceBookingCapacityIndexCtrl = this.fb.control('', Validators.required);
      this.resourceAreaIdCtrl = this.fb.control(this.areaId, Validators.required);
      this.resourceForm = this.fb.group({
          name: this.resourceNamelCtrl,
          description: this.resourceDescriptionCtrl,
          resourceInstances: this.resourceInstancesCtrl,
          bookingCapacityIndex: this.resourceBookingCapacityIndexCtrl,
          areaId: this.resourceAreaIdCtrl
        });
    }

  openModal(id: string) {
      this.modalId = id;
      this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  addResource(){
      console.log(this.resourceForm.value);
      this._descriptionService.addResource(this.resourceForm.value, {companyId: this.companyId}).subscribe(
          (data) => {
              console.log(data);
              this.store.dispatch(new AddResource(data));
              this.closeModal(this.modalId);
          },
          (error) => {console.log(error)}
      );
  }
}

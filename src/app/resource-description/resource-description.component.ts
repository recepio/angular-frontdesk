import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from '../services/modal.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkSpaceDescriptionService} from '../services/work-space-description.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {AddDescription, AddPrice, AddResource} from '../store/actions/workspace.actions';

@Component({
  selector: 'app-resource-description',
  templateUrl: './resource-description.component.html',
  styleUrls: ['./resource-description.component.scss']
})
export class ResourceDescriptionComponent implements OnInit {

  @Input() companyId: string;
  resource: any[];
  prices: any[];
  descriptions: any[];
  descriptionForm: FormGroup;
  priceForm: FormGroup;
  descriptionKeyCtrl: FormControl;
  descriptionValueCtrl: FormControl;
  descriptionResourceIdCtrl: FormControl;
  priceNameCtrl: FormControl;
  priceBasePricePerUseCtrl: FormControl;
  priceFixedChargeCtrl: FormControl;
  priceResourceBookingClassCtrl: FormControl;
  pricePeriodOfUseCtrl: FormControl;
  priceDiscountCtrl: FormControl;
  priceResourceIdCtrl: FormControl;
  constructor(
      private modalService: ModalService,
      private  fb: FormBuilder,
      private  _descriptionService: WorkSpaceDescriptionService,
      private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.modalService.getData().subscribe((data) => {
      this.resource = data;
      this.prices = data.prices;
      this.descriptions = data.descriptions;
      this.descriptionResourceIdCtrl.setValue(data.id);
      this.priceResourceIdCtrl.setValue(data.id);
    });
    this.initialiseForms();
  }

  private initialiseForms() {
      this.descriptionKeyCtrl = this.fb.control('', Validators.required);
      this.descriptionValueCtrl = this.fb.control('', Validators.required);
      this.descriptionResourceIdCtrl = this.fb.control('', Validators.required);
      this.descriptionForm = this.fb.group({
          name: this.descriptionKeyCtrl,
          description: this.descriptionValueCtrl,
          resourceId: this.descriptionResourceIdCtrl
      });
      this.priceBasePricePerUseCtrl = this.fb.control('', Validators.required);
      this.priceNameCtrl = this.fb.control('', Validators.required);
      this.priceFixedChargeCtrl = this.fb.control('', Validators.required);
      this.priceDiscountCtrl = this.fb.control('', Validators.required);
      this.pricePeriodOfUseCtrl = this.fb.control('', Validators.required);
      this.priceResourceBookingClassCtrl = this.fb.control('', Validators.required);
      this.priceResourceIdCtrl = this.fb.control('', Validators.required);
      this.priceForm = this.fb.group({
          name: this.priceNameCtrl,
          fixedCharge: this.priceFixedChargeCtrl,
          discount: this.priceDiscountCtrl,
          periodOfUse: this.pricePeriodOfUseCtrl,
          resourceBookingClass: this.priceResourceBookingClassCtrl,
          basePricePerUse: this.priceBasePricePerUseCtrl,
          resourceId: this.priceResourceIdCtrl
      });
  }

  addDescription() {
    console.log(this.descriptionForm.value);
    this._descriptionService.addDescription(this.descriptionForm.value, {companyId: this.companyId}).subscribe(
        (data) => {
            console.log(data);
            this.store.dispatch(new AddDescription(data));
        },
        (error) => {console.log(error)}
    );
  }

  addPrice() {
      console.log(this.priceForm.value);
      this._descriptionService.addPrice(this.priceForm.value, {companyId: this.companyId}).subscribe(
          (data) => {
              console.log(data);
              this.store.dispatch(new AddPrice(data));
          },
          (error) => {console.log(error)}
      );
  }
}

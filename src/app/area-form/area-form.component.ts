import { Component, Input, OnInit } from '@angular/core';

import { Area } from '../area';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.scss']
})
export class AreaFormComponent implements OnInit {

  @Input() model: Area;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // this.submitted = true;
    /*this.userService.add(this.model as User).subscribe();*/
  }

}

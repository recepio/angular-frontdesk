import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCompanyComponent } from './auth-company.component';

describe('AuthCompanyComponent', () => {
  let component: AuthCompanyComponent;
  let fixture: ComponentFixture<AuthCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

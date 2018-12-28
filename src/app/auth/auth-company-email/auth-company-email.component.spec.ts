import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCompanyEmailComponent } from './auth-company-email.component';

describe('AuthCompanyEmailComponent', () => {
  let component: AuthCompanyEmailComponent;
  let fixture: ComponentFixture<AuthCompanyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCompanyEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCompanyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

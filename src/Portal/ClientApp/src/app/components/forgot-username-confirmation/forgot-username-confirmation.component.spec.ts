import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUserNameConfirmationComponent } from './forgot-username-confirmation.component';

describe('ForgotUserNameConfirmationComponent', () => {
  let component: ForgotUserNameConfirmationComponent;
  let fixture: ComponentFixture<ForgotUserNameConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotUserNameConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUserNameConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUserNameComponent } from './forgot-username.component';

describe('ForgotUserNameComponent', () => {
  let component: ForgotUserNameComponent;
  let fixture: ComponentFixture<ForgotUserNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotUserNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

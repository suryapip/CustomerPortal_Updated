import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceClosedComponent } from './invoices-closed.component';

describe('InvoiceClosedComponent', () => {
  let component: InvoiceClosedComponent;
  let fixture: ComponentFixture<InvoiceClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

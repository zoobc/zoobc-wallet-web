import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEscrowApprovalComponent } from './form-escrow-approval.component';

describe('FormEscrowApprovalComponent', () => {
  let component: FormEscrowApprovalComponent;
  let fixture: ComponentFixture<FormEscrowApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEscrowApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEscrowApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

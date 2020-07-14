import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalEscrowTransactionComponent } from './approval-escrow-transaction.component';

describe('ApprovalEscrowTransactionComponent', () => {
  let component: ApprovalEscrowTransactionComponent;
  let fixture: ComponentFixture<ApprovalEscrowTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalEscrowTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalEscrowTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

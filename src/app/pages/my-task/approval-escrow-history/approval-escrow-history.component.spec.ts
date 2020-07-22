import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalEscrowHistoryComponent } from './approval-escrow-history.component';

describe('ApprovalEscrowHistoryComponent', () => {
  let component: ApprovalEscrowHistoryComponent;
  let fixture: ComponentFixture<ApprovalEscrowHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalEscrowHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalEscrowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

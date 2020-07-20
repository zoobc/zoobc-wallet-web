import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisigApprovalHistoryComponent } from './multisig-approval-history.component';

describe('MultisigApprovalHistoryComponent', () => {
  let component: MultisigApprovalHistoryComponent;
  let fixture: ComponentFixture<MultisigApprovalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigApprovalHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

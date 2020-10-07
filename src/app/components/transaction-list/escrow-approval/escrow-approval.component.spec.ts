import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalEscrowComponent } from './escrow-approval.component';

describe('ApprovalEscrowComponent', () => {
  let component: ApprovalEscrowComponent;
  let fixture: ComponentFixture<ApprovalEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalEscrowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

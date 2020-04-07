import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowTransactionDetailComponent } from './escrow-transaction-detail.component';

describe('EscrowTransactionDetailComponent', () => {
  let component: EscrowTransactionDetailComponent;
  let fixture: ComponentFixture<EscrowTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

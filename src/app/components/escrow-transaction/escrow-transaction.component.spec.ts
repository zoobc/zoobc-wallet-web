import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowTransactionComponent } from './escrow-transaction.component';

describe('EscrowTransactionComponent', () => {
  let component: EscrowTransactionComponent;
  let fixture: ComponentFixture<EscrowTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisigTransactionComponent } from './multisig-transaction.component';

describe('MultisigTransactionComponent', () => {
  let component: MultisigTransactionComponent;
  let fixture: ComponentFixture<MultisigTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

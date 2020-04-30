import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultisigInfoComponent } from './add-multisig-info.component';

describe('AddMultisigInfoComponent', () => {
  let component: AddMultisigInfoComponent;
  let fixture: ComponentFixture<AddMultisigInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultisigInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultisigInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

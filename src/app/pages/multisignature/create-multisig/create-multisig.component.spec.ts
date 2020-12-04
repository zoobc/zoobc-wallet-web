import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMultisigComponent } from './create-multisig.component';

describe('CreateMultisigComponent', () => {
  let component: CreateMultisigComponent;
  let fixture: ComponentFixture<CreateMultisigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMultisigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMultisigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

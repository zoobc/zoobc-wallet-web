import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEscrowComponent } from './form-escrow.component';

describe('FormEscrowComponent', () => {
  let component: FormEscrowComponent;
  let fixture: ComponentFixture<FormEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

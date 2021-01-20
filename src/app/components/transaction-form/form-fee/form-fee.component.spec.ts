import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFeeComponent } from './form-fee.component';

describe('FormFeeComponent', () => {
  let component: FormFeeComponent;
  let fixture: ComponentFixture<FormFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

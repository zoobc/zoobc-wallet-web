import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLiquidComponent } from './form-liquid.component';

describe('FormLiquidComponent', () => {
  let component: FormLiquidComponent;
  let fixture: ComponentFixture<FormLiquidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLiquidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLiquidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegisterNodeComponent } from './form-register-node.component';

describe('FormRegisterNodeComponent', () => {
  let component: FormRegisterNodeComponent;
  let fixture: ComponentFixture<FormRegisterNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRegisterNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegisterNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

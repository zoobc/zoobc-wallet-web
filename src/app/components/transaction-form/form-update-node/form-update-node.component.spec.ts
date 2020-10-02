import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateNodeComponent } from './form-update-node.component';

describe('FormUpdateNodeComponent', () => {
  let component: FormUpdateNodeComponent;
  let fixture: ComponentFixture<FormUpdateNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUpdateNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUpdateNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRemoveNodeComponent } from './form-remove-node.component';

describe('FormRemoveNodeComponent', () => {
  let component: FormRemoveNodeComponent;
  let fixture: ComponentFixture<FormRemoveNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRemoveNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRemoveNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

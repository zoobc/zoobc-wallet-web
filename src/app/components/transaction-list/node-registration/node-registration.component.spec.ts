import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRegistrationComponent } from './node-registration.component';

describe('RegisterNodeComponent', () => {
  let component: NodeRegistrationComponent;
  let fixture: ComponentFixture<NodeRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeRegistrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

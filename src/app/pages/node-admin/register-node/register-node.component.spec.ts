import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNodeComponent } from './register-node.component';

describe('RegisterNodeComponent', () => {
  let component: RegisterNodeComponent;
  let fixture: ComponentFixture<RegisterNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

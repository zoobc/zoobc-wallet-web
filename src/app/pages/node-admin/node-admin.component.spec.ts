import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeAdminComponent } from './node-admin.component';

describe('NodeAdminComponent', () => {
  let component: NodeAdminComponent;
  let fixture: ComponentFixture<NodeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

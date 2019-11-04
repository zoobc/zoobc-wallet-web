import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNodeAdminComponent } from './demo-node-admin.component';

describe('DemoNodeAdminComponent', () => {
  let component: DemoNodeAdminComponent;
  let fixture: ComponentFixture<DemoNodeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoNodeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNodeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

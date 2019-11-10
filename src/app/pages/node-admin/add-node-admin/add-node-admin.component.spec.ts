import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNodeAdminComponent } from './add-node-admin.component';

describe('AddNodeAdminComponent', () => {
  let component: AddNodeAdminComponent;
  let fixture: ComponentFixture<AddNodeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

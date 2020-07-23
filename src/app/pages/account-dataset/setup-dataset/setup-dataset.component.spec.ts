import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDatasetComponent } from './setup-dataset.component';

describe('SetupDatasetComponent', () => {
  let component: SetupDatasetComponent;
  let fixture: ComponentFixture<SetupDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

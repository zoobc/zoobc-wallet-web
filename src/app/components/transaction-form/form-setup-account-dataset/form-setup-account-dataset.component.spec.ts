import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSetupAccountDatasetComponent } from './form-setup-account-dataset.component';

describe('FormSetupAccountDatasetComponent', () => {
  let component: FormSetupAccountDatasetComponent;
  let fixture: ComponentFixture<FormSetupAccountDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSetupAccountDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSetupAccountDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

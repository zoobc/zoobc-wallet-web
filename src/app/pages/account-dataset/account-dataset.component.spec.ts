import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDatasetComponent } from './account-dataset.component';

describe('AccountDatasetComponent', () => {
  let component: AccountDatasetComponent;
  let fixture: ComponentFixture<AccountDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

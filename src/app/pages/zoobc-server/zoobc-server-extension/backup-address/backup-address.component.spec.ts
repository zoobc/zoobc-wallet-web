import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupAddressComponent } from './backup-address.component';

describe('BackupAddressComponent', () => {
  let component: BackupAddressComponent;
  let fixture: ComponentFixture<BackupAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

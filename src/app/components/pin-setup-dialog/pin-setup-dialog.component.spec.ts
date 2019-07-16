import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinSetupDialogComponent } from './pin-setup-dialog.component';

describe('PinSetupDialogComponent', () => {
  let component: PinSetupDialogComponent;
  let fixture: ComponentFixture<PinSetupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinSetupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinSetupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

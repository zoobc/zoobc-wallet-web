import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisigInfoComponent } from './multisig-info.component';

describe('MultisigInfoComponent', () => {
  let component: MultisigInfoComponent;
  let fixture: ComponentFixture<MultisigInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

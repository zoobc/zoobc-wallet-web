import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisignatureComponent } from './multisignature.component';

describe('MultisignatureComponent', () => {
  let component: MultisignatureComponent;
  let fixture: ComponentFixture<MultisignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

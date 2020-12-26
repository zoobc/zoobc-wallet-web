import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisigDetailComponent } from './multisig-detail.component';

describe('MultisigDetailComponent', () => {
  let component: MultisigDetailComponent;
  let fixture: ComponentFixture<MultisigDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

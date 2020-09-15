import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisigDraftComponent } from './multisig-draft.component';

describe('MultisigDraftComponent', () => {
  let component: MultisigDraftComponent;
  let fixture: ComponentFixture<MultisigDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

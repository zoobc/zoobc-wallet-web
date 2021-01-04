import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowDetailComponent } from './escrow-detail.component';

describe('EscrowDetailComponent', () => {
  let component: EscrowDetailComponent;
  let fixture: ComponentFixture<EscrowDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

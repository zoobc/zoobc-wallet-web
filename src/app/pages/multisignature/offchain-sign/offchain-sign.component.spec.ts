import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffchainSignComponent } from './offchain-sign.component';

describe('OffchainSignComponent', () => {
  let component: OffchainSignComponent;
  let fixture: ComponentFixture<OffchainSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffchainSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffchainSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

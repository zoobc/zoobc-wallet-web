import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeIpAddressComponent } from './change-ip-address.component';

describe('ChangeIpAddressComponent', () => {
  let component: ChangeIpAddressComponent;
  let fixture: ComponentFixture<ChangeIpAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeIpAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeIpAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

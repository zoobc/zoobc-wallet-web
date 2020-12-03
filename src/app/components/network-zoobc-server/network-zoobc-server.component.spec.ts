/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkZoobcServerComponent } from './network-zoobc-server.component';

describe('NetworkZoobcServerComponent', () => {
  let component: NetworkZoobcServerComponent;
  let fixture: ComponentFixture<NetworkZoobcServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkZoobcServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkZoobcServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

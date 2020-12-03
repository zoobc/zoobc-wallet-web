import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoobcServerComponent } from './zoobc-server.component';

describe('PushNotifications', () => {
  let component: ZoobcServerComponent;
  let fixture: ComponentFixture<ZoobcServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZoobcServerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoobcServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

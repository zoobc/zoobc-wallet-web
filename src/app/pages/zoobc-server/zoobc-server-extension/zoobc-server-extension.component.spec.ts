import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoobcServerExtensionComponent } from './zoobc-server-extension.component';

describe('Push', () => {
  let component: ZoobcServerExtensionComponent;
  let fixture: ComponentFixture<ZoobcServerExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZoobcServerExtensionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoobcServerExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

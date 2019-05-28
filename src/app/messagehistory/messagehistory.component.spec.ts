import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagehistoryComponent } from './messagehistory.component';

describe('MessagehistoryComponent', () => {
  let component: MessagehistoryComponent;
  let fixture: ComponentFixture<MessagehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

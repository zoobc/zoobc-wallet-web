import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateKeyComponent } from './private-key.component';

describe('PrivateKeyComponent', () => {
  let component: PrivateKeyComponent;
  let fixture: ComponentFixture<PrivateKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

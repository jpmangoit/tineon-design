import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdisplayMessagesComponent } from './mdisplay-messages.component';

describe('MdisplayMessagesComponent', () => {
  let component: MdisplayMessagesComponent;
  let fixture: ComponentFixture<MdisplayMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdisplayMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdisplayMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

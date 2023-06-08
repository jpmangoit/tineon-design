import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McommunityMessagesComponent } from './mcommunity-messages.component';

describe('McommunityMessagesComponent', () => {
  let component: McommunityMessagesComponent;
  let fixture: ComponentFixture<McommunityMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McommunityMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McommunityMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMessagesComponent } from './club-messages.component';

describe('ClubMessagesComponent', () => {
  let component: ClubMessagesComponent;
  let fixture: ComponentFixture<ClubMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

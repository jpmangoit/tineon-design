import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventComponent } from './organizer-event.component';

describe('OrganizerEventComponent', () => {
  let component: OrganizerEventComponent;
  let fixture: ComponentFixture<OrganizerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

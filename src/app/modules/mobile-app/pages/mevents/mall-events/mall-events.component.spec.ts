import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallEventsComponent } from './mall-events.component';

describe('MallEventsComponent', () => {
  let component: MallEventsComponent;
  let fixture: ComponentFixture<MallEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MallEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

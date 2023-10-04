import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorganizerTaskDetailsComponent } from './morganizer-task-details.component';

describe('MorganizerTaskDetailsComponent', () => {
  let component: MorganizerTaskDetailsComponent;
  let fixture: ComponentFixture<MorganizerTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorganizerTaskDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorganizerTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

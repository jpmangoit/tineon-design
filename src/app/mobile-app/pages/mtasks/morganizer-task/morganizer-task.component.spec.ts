import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorganizerTaskComponent } from './morganizer-task.component';

describe('MorganizerTaskComponent', () => {
  let component: MorganizerTaskComponent;
  let fixture: ComponentFixture<MorganizerTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorganizerTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorganizerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

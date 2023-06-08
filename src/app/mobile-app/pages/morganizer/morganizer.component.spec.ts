import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorganizerComponent } from './morganizer.component';

describe('MorganizerComponent', () => {
  let component: MorganizerComponent;
  let fixture: ComponentFixture<MorganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorganizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

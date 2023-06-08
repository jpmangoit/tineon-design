import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McourseComponent } from './mcourse.component';

describe('McourseComponent', () => {
  let component: McourseComponent;
  let fixture: ComponentFixture<McourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

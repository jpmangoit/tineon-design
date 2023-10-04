import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McompletedSurveyComponent } from './mcompleted-survey.component';

describe('McompletedSurveyComponent', () => {
  let component: McompletedSurveyComponent;
  let fixture: ComponentFixture<McompletedSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McompletedSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McompletedSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

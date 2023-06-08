import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McrmActiveSurveyComponent } from './mcrm-active-survey.component';

describe('McrmActiveSurveyComponent', () => {
  let component: McrmActiveSurveyComponent;
  let fixture: ComponentFixture<McrmActiveSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McrmActiveSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McrmActiveSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

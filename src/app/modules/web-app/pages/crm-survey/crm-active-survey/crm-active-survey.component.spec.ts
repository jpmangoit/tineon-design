import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActiveSurveyComponent } from './crm-active-survey.component';

describe('CrmActiveSurveyComponent', () => {
  let component: CrmActiveSurveyComponent;
  let fixture: ComponentFixture<CrmActiveSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmActiveSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActiveSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrmSurveyVoteComponent } from './crm-survey-vote.component';

describe('CrmSurveyVoteComponent', () => {
  let component: CrmSurveyVoteComponent;
  let fixture: ComponentFixture<CrmSurveyVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmSurveyVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSurveyVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmMyVotesComponent } from './crm-my-votes.component';

describe('CrmMyVotesComponent', () => {
  let component: CrmMyVotesComponent;
  let fixture: ComponentFixture<CrmMyVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmMyVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmMyVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

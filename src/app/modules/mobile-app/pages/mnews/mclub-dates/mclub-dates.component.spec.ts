import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubDatesComponent } from './mclub-dates.component';

describe('MclubDatesComponent', () => {
  let component: MclubDatesComponent;
  let fixture: ComponentFixture<MclubDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MclubDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

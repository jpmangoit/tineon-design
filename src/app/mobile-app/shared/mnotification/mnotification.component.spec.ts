import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnotificationComponent } from './mnotification.component';

describe('MnotificationComponent', () => {
  let component: MnotificationComponent;
  let fixture: ComponentFixture<MnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

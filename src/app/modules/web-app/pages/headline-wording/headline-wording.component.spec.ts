import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineWordingComponent } from './headline-wording.component';

describe('HeadlineWordingComponent', () => {
  let component: HeadlineWordingComponent;
  let fixture: ComponentFixture<HeadlineWordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadlineWordingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadlineWordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

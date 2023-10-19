import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubNewsComponent } from './mclub-news.component';

describe('MclubNewsComponent', () => {
  let component: MclubNewsComponent;
  let fixture: ComponentFixture<MclubNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MclubNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

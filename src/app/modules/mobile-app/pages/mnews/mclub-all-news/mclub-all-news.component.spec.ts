import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubAllNewsComponent } from './mclub-all-news.component';

describe('MclubAllNewsComponent', () => {
  let component: MclubAllNewsComponent;
  let fixture: ComponentFixture<MclubAllNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubAllNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MclubAllNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

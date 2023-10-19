import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallNewsComponent } from './mall-news.component';

describe('MallNewsComponent', () => {
  let component: MallNewsComponent;
  let fixture: ComponentFixture<MallNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MallNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

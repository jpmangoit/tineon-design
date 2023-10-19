import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeOptionComponent } from './theme-option.component';

describe('ThemeOptionComponent', () => {
  let component: ThemeOptionComponent;
  let fixture: ComponentFixture<ThemeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

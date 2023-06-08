import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileThemeComponent } from './mobile-theme.component';

describe('MobileThemeComponent', () => {
  let component: MobileThemeComponent;
  let fixture: ComponentFixture<MobileThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileThemeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileBankComponent } from './mprofile-bank.component';

describe('MprofileBankComponent', () => {
  let component: MprofileBankComponent;
  let fixture: ComponentFixture<MprofileBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

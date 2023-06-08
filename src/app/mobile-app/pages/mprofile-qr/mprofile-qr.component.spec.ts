import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileQrComponent } from './mprofile-qr.component';

describe('MprofileQrComponent', () => {
  let component: MprofileQrComponent;
  let fixture: ComponentFixture<MprofileQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

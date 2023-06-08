import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmemberProfileComponent } from './mmember-profile.component';

describe('MmemberProfileComponent', () => {
  let component: MmemberProfileComponent;
  let fixture: ComponentFixture<MmemberProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmemberProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MmemberProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

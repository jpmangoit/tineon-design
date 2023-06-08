import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpersonalMessageComponent } from './mpersonal-message.component';

describe('MpersonalMessageComponent', () => {
  let component: MpersonalMessageComponent;
  let fixture: ComponentFixture<MpersonalMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpersonalMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpersonalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

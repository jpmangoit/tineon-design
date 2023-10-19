import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MchatComponent } from './mchat.component';

describe('MchatComponent', () => {
  let component: MchatComponent;
  let fixture: ComponentFixture<MchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MchatListComponent } from './mchat-list.component';

describe('MchatListComponent', () => {
  let component: MchatListComponent;
  let fixture: ComponentFixture<MchatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MchatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MchatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionToolComponent } from './action-tool.component';

describe('ActionToolComponent', () => {
  let component: ActionToolComponent;
  let fixture: ComponentFixture<ActionToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

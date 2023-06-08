import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationToolComponent } from './navigation-tool.component';

describe('NavigationToolComponent', () => {
  let component: NavigationToolComponent;
  let fixture: ComponentFixture<NavigationToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

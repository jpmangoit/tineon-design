import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbannerlistComponent } from './mbannerlist.component';

describe('MbannerlistComponent', () => {
  let component: MbannerlistComponent;
  let fixture: ComponentFixture<MbannerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MbannerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbannerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

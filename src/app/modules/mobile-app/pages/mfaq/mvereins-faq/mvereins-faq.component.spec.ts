import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvereinsFaqComponent } from './mvereins-faq.component';

describe('MvereinsFaqComponent', () => {
  let component: MvereinsFaqComponent;
  let fixture: ComponentFixture<MvereinsFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvereinsFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvereinsFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingToolComponent } from './setting-tool.component';

describe('SettingToolComponent', () => {
  let component: SettingToolComponent;
  let fixture: ComponentFixture<SettingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

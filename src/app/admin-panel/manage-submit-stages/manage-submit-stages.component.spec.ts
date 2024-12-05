import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubmitStagesComponent } from './manage-submit-stages.component';

describe('ManageSubmitStagesComponent', () => {
  let component: ManageSubmitStagesComponent;
  let fixture: ComponentFixture<ManageSubmitStagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSubmitStagesComponent]
    });
    fixture = TestBed.createComponent(ManageSubmitStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

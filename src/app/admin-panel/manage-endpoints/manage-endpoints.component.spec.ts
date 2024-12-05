import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEndpointsComponent } from './manage-endpoints.component';

describe('ManageEndpointsComponent', () => {
  let component: ManageEndpointsComponent;
  let fixture: ComponentFixture<ManageEndpointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEndpointsComponent]
    });
    fixture = TestBed.createComponent(ManageEndpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

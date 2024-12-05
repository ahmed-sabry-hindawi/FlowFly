import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupsComponent } from './manage-groups.component';

describe('ManageGroupsComponent', () => {
  let component: ManageGroupsComponent;
  let fixture: ComponentFixture<ManageGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageGroupsComponent]
    });
    fixture = TestBed.createComponent(ManageGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

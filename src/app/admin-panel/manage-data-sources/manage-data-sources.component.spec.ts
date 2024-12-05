import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDataSourcesComponent } from './manage-data-sources.component';

describe('ManageDataSourcesComponent', () => {
  let component: ManageDataSourcesComponent;
  let fixture: ComponentFixture<ManageDataSourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDataSourcesComponent]
    });
    fixture = TestBed.createComponent(ManageDataSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

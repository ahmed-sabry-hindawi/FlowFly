import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesReportComponent } from './services-report.component';

describe('ServicesReportComponent', () => {
  let component: ServicesReportComponent;
  let fixture: ComponentFixture<ServicesReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesReportComponent]
    });
    fixture = TestBed.createComponent(ServicesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkshopRequestsComponent } from './admin-workshop-requests.component';

describe('AdminWorkshopRequestsComponent', () => {
  let component: AdminWorkshopRequestsComponent;
  let fixture: ComponentFixture<AdminWorkshopRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWorkshopRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWorkshopRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

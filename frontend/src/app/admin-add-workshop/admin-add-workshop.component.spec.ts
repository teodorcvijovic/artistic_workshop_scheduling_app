import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddWorkshopComponent } from './admin-add-workshop.component';

describe('AdminAddWorkshopComponent', () => {
  let component: AdminAddWorkshopComponent;
  let fixture: ComponentFixture<AdminAddWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

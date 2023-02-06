import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerAddWorkshopComponent } from './organizer-add-workshop.component';

describe('OrganizerAddWorkshopComponent', () => {
  let component: OrganizerAddWorkshopComponent;
  let fixture: ComponentFixture<OrganizerAddWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerAddWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerAddWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

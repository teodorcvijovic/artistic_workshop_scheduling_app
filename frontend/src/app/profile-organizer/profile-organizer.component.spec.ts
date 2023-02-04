import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrganizerComponent } from './profile-organizer.component';

describe('ProfileOrganizerComponent', () => {
  let component: ProfileOrganizerComponent;
  let fixture: ComponentFixture<ProfileOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOrganizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

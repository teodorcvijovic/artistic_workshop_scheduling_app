import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerChatComponent } from './organizer-chat.component';

describe('OrganizerChatComponent', () => {
  let component: OrganizerChatComponent;
  let fixture: ComponentFixture<OrganizerChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

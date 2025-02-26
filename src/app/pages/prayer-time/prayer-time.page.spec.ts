import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrayerTimePage } from './prayer-time.page';

describe('PrayerTimePage', () => {
  let component: PrayerTimePage;
  let fixture: ComponentFixture<PrayerTimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

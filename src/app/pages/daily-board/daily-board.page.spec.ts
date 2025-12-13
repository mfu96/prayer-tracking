import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyBoardPage } from './daily-board.page';

describe('DailyBoardPage', () => {
  let component: DailyBoardPage;
  let fixture: ComponentFixture<DailyBoardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

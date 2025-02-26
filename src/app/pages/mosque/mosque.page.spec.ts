import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MosquePage } from './mosque.page';

describe('MosquePage', () => {
  let component: MosquePage;
  let fixture: ComponentFixture<MosquePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MosquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

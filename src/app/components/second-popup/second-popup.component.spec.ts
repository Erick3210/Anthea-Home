import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondPopupComponent } from './second-popup.component';

describe('SecondPopupComponent', () => {
  let component: SecondPopupComponent;
  let fixture: ComponentFixture<SecondPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

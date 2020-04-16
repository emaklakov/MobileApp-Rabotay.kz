import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingReviewsPage } from './rating-reviews.page';

describe('RatingReviewsPage', () => {
  let component: RatingReviewsPage;
  let fixture: ComponentFixture<RatingReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingReviewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

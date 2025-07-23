import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photoeditprofile } from './photoeditprofile';

describe('Photoeditprofile', () => {
  let component: Photoeditprofile;
  let fixture: ComponentFixture<Photoeditprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photoeditprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Photoeditprofile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

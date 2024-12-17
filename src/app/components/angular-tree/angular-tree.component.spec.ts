import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularTreeComponent } from './angular-tree.component';

describe('AngularTreeComponent', () => {
  let component: AngularTreeComponent;
  let fixture: ComponentFixture<AngularTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

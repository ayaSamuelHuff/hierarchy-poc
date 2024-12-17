import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3jsTreeComponent } from './d3js-tree.component';

describe('D3jsTreeComponent', () => {
  let component: D3jsTreeComponent;
  let fixture: ComponentFixture<D3jsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3jsTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(D3jsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

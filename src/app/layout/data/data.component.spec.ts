import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { DataComponent } from './data.component'
import { DataModule } from './data.module'

describe('DataComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(DataComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { PengaturanComponent } from './pengaturan.component'
import { PengaturanModule } from './pengaturan.module'

describe('PengaturanComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PengaturanModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(PengaturanComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

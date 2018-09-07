import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { SettingComponent } from './setting.component'
import { SettingModule } from './setting.module'

describe('SettingComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SettingModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(SettingComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

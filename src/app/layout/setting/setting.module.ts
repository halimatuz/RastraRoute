import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        SettingRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule
        

        ],
    declarations: [
        SettingComponent,
        ]
})
export class SettingModule {

    
}

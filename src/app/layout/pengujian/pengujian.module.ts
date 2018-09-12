import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PengujianRoutingModule } from './pengujian-routing.module';
import { PengujianComponent } from './pengujian.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        PengujianRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule,
        
        

        ],
    declarations: [
        PengujianComponent,
        ]
})
export class PengujianModule {

    
}

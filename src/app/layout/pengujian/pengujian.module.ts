import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PengujianRoutingModule } from './pengujian-routing.module';
import { PengujianComponent } from './pengujian.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

import { ChartsModule as Ng2Charts } from 'ng2-charts';

@NgModule({
    imports: [
        CommonModule, 
        PengujianRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule,
        Ng2Charts
        
        

        ],
    declarations: [
        PengujianComponent,
        ]
})
export class PengujianModule {

    
}

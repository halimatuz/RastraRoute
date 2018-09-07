import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasilRoutingModule } from './hasil-routing.module';
import { HasilComponent } from './hasil.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        HasilRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule
        

        ],
    declarations: [
        HasilComponent,
        ]
})
export class HasilModule {

    
}

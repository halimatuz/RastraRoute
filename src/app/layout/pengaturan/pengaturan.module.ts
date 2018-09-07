import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PengaturanRoutingModule } from './pengaturan-routing.module';
import { PengaturanComponent } from './pengaturan.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        PengaturanRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule,
        
        

        ],
    declarations: [
        PengaturanComponent,
        ]
})
export class PengaturanModule {

    
}

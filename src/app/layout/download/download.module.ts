import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { PageHeaderModule } from './../../shared';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout.module';

@NgModule({
    imports: [
        CommonModule, 
        DownloadRoutingModule, 
        PageHeaderModule, 
        HttpClientModule,
        LayoutModule
        
        ],
    declarations: [
        DownloadComponent
        ]
})
export class DownloadModule {

    
}

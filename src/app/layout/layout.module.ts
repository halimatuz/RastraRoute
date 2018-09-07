import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

import { jqxBarGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbargauge';
import { jqxDataTableComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
import { jqxFileUploadComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxfileupload';


import { FormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        
        ToastrModule.forRoot()
    ],
    declarations: [
        LayoutComponent, 
        SidebarComponent, 
        HeaderComponent,
        jqxBarGaugeComponent,
        jqxDataTableComponent,
        jqxFileUploadComponent
        ],
    exports: [
        jqxBarGaugeComponent,
        jqxDataTableComponent,
        jqxFileUploadComponent,
        FormsModule,
        
        
        
    ]
})
export class LayoutModule {}

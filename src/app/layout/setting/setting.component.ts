import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
    animations: [routerTransition()]
})
export class SettingComponent implements OnInit {
    
 columns: any[] =
    [
        { text: 'First Name', dataField: 'First Name'},
        { text: 'Last Name', dataField: 'Last Name' },
        { text: 'Product', dataField: 'Product' },
        { text: 'Unit Price', dataField: 'Price', align: 'right', cellsAlign: 'right', cellsFormat: 'c2' },
        { text: 'Quantity', dataField: 'Quantity', align: 'right', cellsAlign: 'right', cellsFormat: 'n' }
    ];

    ngOnInit() {
    
    }
}

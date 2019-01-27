import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';


@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    animations: [routerTransition()]
})
export class DownloadComponent implements OnInit {
    constructor(){

    }
    ngOnInit() {
    
    
    }
  
}

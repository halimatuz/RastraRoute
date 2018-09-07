import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor() {
        this.sliders.push(
            {
                imagePath: 'assets/images/Untitled-1.png',
                label: 'Rastra',
                text: 'Program bantuan berupa beras untuk keluarga yang kurang mampu di bidang ekonomi yang sebelumnya bernama Raskin'
            },
            {
                imagePath: 'assets/images/Untitled-3.png',
                label: 'Multi Depot Split Delivery Vehicle Routing Problem',
                text: 'Permasalahan optimasi penentuan rute kendaraan (Distribusi Rastra) dengan keterbatasan banyak depot dan mengizinkan membagi pengataran dalam beberapa kali. '
            },
            {
                imagePath: 'assets/images/Untitled-4.png',
                label: 'Rastra Route',
                text: 'Aplikasi pendukung keputusan penentuan rute distribusi Rastra. Rute distribusi Rastra dihailkan oleh Algoritma Genetika yang menyelesaikan permasalahan optimasi MDSDVRP'
            }
        );

    }

    ngOnInit() {}

}

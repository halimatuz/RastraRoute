import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Route2017 } from './route2017.model';

@Injectable({
  providedIn: 'root'
})
export class Route2017Service {
routeList: AngularFireList<any>;
  selectedRoute: Route2017 = new Route2017();
  constructor(private firebase :AngularFireDatabase ) { }
 
  getData(){
    this.routeList = this.firebase.list('route2017');
    return this.routeList;
  }
}

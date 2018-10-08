import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Route2016 } from './route2016.model';

@Injectable({
  providedIn: 'root'
})
export class Route2016Service {
  routeList: AngularFireList<any>;
  selectedRoute: Route2016 = new Route2016();
  constructor(private firebase :AngularFireDatabase ) { }
 
  getData(){
    this.routeList = this.firebase.list('route2016');
    return this.routeList;
  }
 

}

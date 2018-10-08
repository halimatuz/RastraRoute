import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Route } from './route.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  routeList: AngularFireList<any>;
  selectedRoute: Route = new Route();
  constructor(private firebase :AngularFireDatabase ) { }
 
  getData(){
    this.routeList = this.firebase.list('route');
    return this.routeList;
  }
 
  insertEmployee(route : Route)
  {
    if(!this.routeList){
      this.routeList = this.getData();
    }
    this.routeList.push({
        index: route.index,
        subRoute: route.subRoute,
        fgudang: route.fgudang,
        isDelivered : false,
    });
  }
  removeData(){
    this.routeList = this.firebase.list('route');
    this.routeList.remove();
  }
}

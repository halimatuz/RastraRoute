import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Rastra } from './rastra.model';

@Injectable({
  providedIn: 'root'
})
export class RastraService {

  rastraList: AngularFireList<any>;
  selectedRastra: Rastra = new Rastra();
  constructor(private firebase :AngularFireDatabase ) { }
 
  getData(){
    this.rastraList = this.firebase.list('rastra');
    return this.rastraList;
  }
 
  insertEmployee(rastra : Rastra)
  {
    if(!this.rastraList){
      this.rastraList = this.getData();
    }
    this.rastraList.push({
      kabupaten: rastra.kabupaten,
      kecamatan: rastra.kecamatan,
      desa: rastra.desa,
      colli: rastra.colli
    });
  }
  removeData(){
    this.rastraList = this.firebase.list('rastra');
    this.rastraList.remove();
  }
}

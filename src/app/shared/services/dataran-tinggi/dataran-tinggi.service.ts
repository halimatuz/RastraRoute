import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { DataranTinggi } from './dataran-tinggi.model';

@Injectable({
  providedIn: 'root'
})
export class DataranTinggiService {
    dataranList: AngularFireList<any>;
  

  constructor(private firebase :AngularFireDatabase ) {
   
   }

  getData(){
    this.dataranList = this.firebase.list('dataran_tinggi');
    return this.dataranList;
  }
 
  insertDataran(kec :string, desa:string)
  {
    if(!this.dataranList){
      this.dataranList = this.getData();
    }
    this.dataranList.push({
      kecamatan: kec,
      desa: desa
    });
  }
 
  deleteDataran($key : string){
    this.dataranList.remove($key);
  }
}

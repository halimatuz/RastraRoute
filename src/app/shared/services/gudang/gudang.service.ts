import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Gudang } from './gudang.model';

@Injectable({
  providedIn: 'root'
})
export class GudangService {

gudangList: AngularFireList<any>;
  selectedGudang: Gudang = new Gudang();
  

  constructor(private firebase :AngularFireDatabase ) {
   
   }

  getData(){
    this.gudangList = this.firebase.list('gudang');
    return this.gudangList;
  }
 
  insertEmployee(employee : Gudang)
  {
    if(!this.gudangList){
      this.gudangList = this.getData();
    }
    this.gudangList.push({
      namaGudang: employee.namaGudang,
      kapasitas: employee.kapasitas,
      stok: employee.stok
    });
  }
  updateEmployee(employee : Gudang){
    this.gudangList.update(employee.$key,
      {
      kapasitas: employee.kapasitas,
      stok: employee.stok
      });
  }
 
  deleteEmployee($key : string){
    this.gudangList.remove($key);
  }
 
  

}

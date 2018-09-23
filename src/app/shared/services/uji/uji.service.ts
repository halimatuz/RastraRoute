import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Uji } from './uji.model';
@Injectable({
  providedIn: 'root'
})
export class UjiService {
  ujiList: AngularFireList<any>;
  selectedUji: Uji = new Uji();
  

  constructor(private firebase :AngularFireDatabase ) {
   
   }

  getData(){
    this.ujiList = this.firebase.list('uji');
    return this.ujiList;
  }
 
  insertUji(uji : Uji)
  {
    if(!this.ujiList){
      this.ujiList = this.getData();
    }
    this.ujiList.push({
      numPop : 50,
      numGen : uji.numGen,
      pc : uji.pc,
      pm : uji.pm
    });
  }
  updateUji(uji : Uji){
    this.ujiList.update(uji.$key,
      {
      numPop : 50,
      numGen : uji.numGen,
      pc : uji.pc,
      pm : uji.pm
      });
  }
}

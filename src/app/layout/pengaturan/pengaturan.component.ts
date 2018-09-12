import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { GudangService } from '../../shared/services/gudang/gudang.service';
import { Gudang } from '../../shared/services/gudang/gudang.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-pengaturan',
    templateUrl: './pengaturan.component.html',
    styleUrls: ['./pengaturan.component.scss'],
    animations: [routerTransition()]
})
export class PengaturanComponent implements OnInit {
    
    
    gudangList: Gudang[];
constructor(private gudangService: GudangService,  private tostr: ToastrService){
    }
    ngOnInit() {
        var x = this.gudangService.getData();
        x.snapshotChanges().subscribe(item => {
      this.gudangList= [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.gudangList.push(y as Gudang);
      });
      
    });
    this.resetForm();
    }
    onSubmit(employeeForm: NgForm) {
    if (employeeForm.value.$key == null)
      this.gudangService.insertEmployee(employeeForm.value);
    else
      this.gudangService.updateEmployee(employeeForm.value);
    this.resetForm(employeeForm);
    this.tostr.success('Berhasil Ditambahkan !', 'Data Gudang');
  }
 
  resetForm(employeeForm?: NgForm) {
    if (employeeForm != null)
      employeeForm.reset();
    this.gudangService.selectedGudang = {
      $key: null,
      namaGudang: '',
      kapasitas: 0,
      stok: 0
    }
  }
  onEdit(emp: Gudang) {
    this.gudangService.selectedGudang = Object.assign({}, emp);
  }
 
  onDelete(key: string) {
    if (confirm('Apakah anda yakin ingin menghapus data ini ?') == true) {
      this.gudangService.deleteEmployee(key);
      this.tostr.error('Berhasil Dihapus !', 'Data Gudang');
    }
  }   

}

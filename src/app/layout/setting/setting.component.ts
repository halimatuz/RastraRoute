import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { FirebaseUserModel } from '../../shared/guard/user.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/guard/user.service';
import { AuthService } from '../../shared/guard/auth.service';


@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
    animations: [routerTransition()]
})
export class SettingComponent implements OnInit {
 
 user: FirebaseUserModel = new FirebaseUserModel();
 username: string="";
 pass_1 : string="";
 pass_2 : string="";
 err_m: string="";

    constructor(
    public userService: UserService,
    private route: ActivatedRoute,
     private router: Router,
     public authService: AuthService
  ) {

  }
    ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
  }
  onViewEdit(){
    this.username=this.user.name;
    
  }
  onSubmit(form: NgForm){
    
        if(this.user.provider=="password"){
                if(form.value.pass1!=form.value.pass2){
                    this.err_m="Password yang Anda Masukkan Tidak Valid";
                }
                else{
                this.userService.updateCurrentUser(form.value)
                .then(res => {
                console.log(res);
                }, err => {
                    console.log(err);
                    this.err_m=err;
                });
                this.userService.updateCurrentUser2(form.value)
                .then(res => {
                this.onLoggedout();
                }, err => {
                    console.log(err);
                    this.err_m=err;
                });
                }
        }
        else{
            this.userService.updateCurrentUser(form.value)
                .then(res => {
                location.reload();
                }, err => {
                    console.log(err);
                    this.err_m=err;
                });
         
        }
        
    }
    onLoggedout() {
       this.authService.doLogout()
    .then((res) => {
      this.router.navigate(['/login']);
    }, (error) => {
      console.log("Logout error", error);
    });
    }
    
  
}

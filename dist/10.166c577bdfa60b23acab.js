(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{Gvg9:function(l,n,t){"use strict";t.r(n);var e=t("CcnG"),a=function(){},u=t("pMnS"),o=t("gIcY"),i=t("rMXk"),d=t("3zLz"),r=t("IG+k"),s=t("NYhv"),p=t("Ip0R"),c=t("zNxu"),g=t("z8Zs"),m=t("NTnD"),h=t("u7nK"),f=t("6233"),y=function(){},b=function(){function l(l){this.firebase=l,this.selectedRoute=new y}return l.prototype.getData=function(){return this.routeList=this.firebase.list("route"),this.routeList},l.prototype.insertEmployee=function(l){this.routeList||(this.routeList=this.getData()),this.routeList.push({index:l.index,subRoute:l.subRoute,fgudang:l.fgudang,isDelivered:!1})},l.prototype.removeData=function(){this.routeList=this.firebase.list("route"),this.routeList.remove()},l.ngInjectableDef=e.defineInjectable({factory:function(){return new l(e.inject(f.a))},token:l,providedIn:"root"}),l}(),v=t("H3It"),x=function(){function l(l,n,t,e){this.gen=l,this.gudangService=n,this.routeService=t,this.gen2=e,this.columns=[{text:"Sub Route",dataField:"idx"},{text:"Gudang",dataField:"gudang"},{text:"Kab/Kota",dataField:"kab"},{text:"Kecamatan",dataField:"kecamatan"},{text:"Desa",dataField:"desa"},{text:"Load",dataField:"load"}]}return l.prototype.ngOnInit=function(){var l=this;this.gudangService.getData().snapshotChanges().subscribe(function(n){l.gudangList=[],n.forEach(function(n){var t=n.payload.toJSON();t.$key=n.key,l.gudangList.push(t)}),l.routeService.getData().snapshotChanges().subscribe(function(n){l.routeList=[],n.forEach(function(n){for(var t=n.payload.toJSON(),e=0,a=0,u=Object.values(t.subRoute);a<u.length;a++){var o=u[a],i={};i.infGudang=l.gudangList[t.fgudang].namaGudang,0==e?(i.idx=t.index,i.gudang=l.gudangList[t.fgudang].namaGudang):(i.idx="",i.gudang="");for(var d=0,r=Object.entries(o);d<r.length;d++){var s=r[d];i[s[0]]=s[1]}l.routeList.push(i),e++}}),l.source={localData:l.routeList,dataType:"array",dataFields:[{name:"idx",type:"string"},{name:"gudang",type:"string"},{name:"kab",type:"string"},{name:"kecamatan",type:"string"},{name:"desa",type:"string"},{name:"load",type:"string"}]},l.dataAdapter=new jqx.dataAdapter(l.source)})})},l.prototype.excelExport=function(){this.myDataTable.exportData("xls")},l.prototype.calculate=function(){var l=this;this.jqxLoader.open(),this.gen2.GA(50,100,.6,.01).then(function(n){console.log(n),l.routeService.removeData();for(var t=0;t<n[1].length;t++){var e=new y;e.fgudang=n[2][t],e.index=t,e.subRoute=n[1][t],l.routeService.insertEmployee(e)}l.jqxLoader.close()})},l.prototype.onChange=function(l){if("all"!=l){for(var n=[],t=0;t<this.routeList.length;t++)this.routeList[t].infGudang==this.gudangList[l].namaGudang&&n.push(this.routeList[t]);this.source={localData:n,dataType:"array",dataFields:[{name:"idx",type:"string"},{name:"gudang",type:"string"},{name:"kab",type:"string"},{name:"kecamatan",type:"string"},{name:"desa",type:"string"},{name:"load",type:"string"}]},this.dataAdapter=new jqx.dataAdapter(this.source)}else this.source={localData:this.routeList,dataType:"array",dataFields:[{name:"idx",type:"string"},{name:"gudang",type:"string"},{name:"kab",type:"string"},{name:"kecamatan",type:"string"},{name:"desa",type:"string"},{name:"load",type:"string"}]},this.dataAdapter=new jqx.dataAdapter(this.source)},l}(),R=e["\u0275crt"]({encapsulation:0,styles:[[""]],data:{animation:[{type:7,name:"routerTransition",definitions:[{type:0,name:"void",styles:{type:6,styles:{},offset:null},options:void 0},{type:0,name:"*",styles:{type:6,styles:{},offset:null},options:void 0},{type:1,expr:":enter",animation:[{type:6,styles:{transform:"translateY(100%)"},offset:null},{type:4,styles:{type:6,styles:{transform:"translateY(0%)"},offset:null},timings:"0.5s ease-in-out"}],options:null},{type:1,expr:":leave",animation:[{type:6,styles:{transform:"translateY(0%)"},offset:null},{type:4,styles:{type:6,styles:{transform:"translateY(-100%)"},offset:null},timings:"0.5s ease-in-out"}],options:null}],options:{}}]}});function L(l){return e["\u0275vid"](0,[(l()(),e["\u0275eld"](0,0,null,null,3,"option",[],null,null,null,null,null)),e["\u0275did"](1,147456,null,0,o.o,[e.ElementRef,e.Renderer2,[8,null]],{value:[0,"value"]},null),e["\u0275did"](2,147456,null,0,o.x,[e.ElementRef,e.Renderer2,[8,null]],{value:[0,"value"]},null),(l()(),e["\u0275ted"](3,null,["",""]))],function(l,n){l(n,1,0,e["\u0275inlineInterpolate"](1,"",n.context.index,"")),l(n,2,0,e["\u0275inlineInterpolate"](1,"",n.context.index,""))},function(l,n){l(n,3,0,n.context.$implicit.namaGudang)})}function C(l){return e["\u0275vid"](0,[e["\u0275qud"](402653184,1,{jqxLoader:0}),e["\u0275qud"](402653184,2,{myDataTable:0}),(l()(),e["\u0275eld"](2,0,null,null,31,"div",[],[[24,"@routerTransition",0]],null,null,null,null)),(l()(),e["\u0275eld"](3,0,null,null,1,"app-page-header",[],null,null,null,i.b,i.a)),e["\u0275did"](4,114688,null,0,d.a,[],{heading:[0,"heading"],icon:[1,"icon"]},null),(l()(),e["\u0275eld"](5,0,null,null,28,"div",[["class","card mb-3 table-responsive"]],null,null,null,null,null)),(l()(),e["\u0275eld"](6,0,null,null,1,"jqxLoader",[],null,null,null,r.b,r.a)),e["\u0275did"](7,638976,[[1,4],["jqxLoader",4]],0,s.a,[e.ElementRef],{attrText:[0,"attrText"],attrWidth:[1,"attrWidth"],attrHeight:[2,"attrHeight"]},null),(l()(),e["\u0275eld"](8,0,null,null,23,"div",[["class","row"],["style","padding:10px"]],null,null,null,null,null)),(l()(),e["\u0275eld"](9,0,null,null,3,"div",[["class","col-sm-7"]],null,null,null,null,null)),(l()(),e["\u0275eld"](10,0,null,null,2,"div",[["class","card-header"],["style","background-color: white;border-bottom-color: white"]],null,null,null,null,null)),(l()(),e["\u0275eld"](11,0,null,null,1,"h5",[],null,null,null,null,null)),(l()(),e["\u0275ted"](-1,null,["Hasil Rute Distribusi Rastra Jombang-Mojokerto"])),(l()(),e["\u0275eld"](13,0,null,null,18,"div",[["class","col-sm-5"]],null,null,null,null,null)),(l()(),e["\u0275eld"](14,0,null,null,17,"div",[["class","row"]],null,null,null,null,null)),(l()(),e["\u0275eld"](15,0,null,null,11,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e["\u0275eld"](16,0,null,null,10,"div",[["class","input-group mb-3"]],null,null,null,null,null)),(l()(),e["\u0275eld"](17,0,null,null,2,"div",[["class","input-group-prepend"]],null,null,null,null,null)),(l()(),e["\u0275eld"](18,0,null,null,1,"label",[["class","input-group-text"],["for","inputGroupSelect01"]],null,null,null,null,null)),(l()(),e["\u0275ted"](-1,null,["Gudang :"])),(l()(),e["\u0275eld"](20,0,null,null,6,"select",[["class","custom-select"],["id","inputGroupSelect01"]],null,[[null,"change"]],function(l,n,t){var e=!0;return"change"===n&&(e=!1!==l.component.onChange(t.target.value)&&e),e},null,null)),(l()(),e["\u0275eld"](21,0,null,null,3,"option",[["selected",""],["value","all"]],null,null,null,null,null)),e["\u0275did"](22,147456,null,0,o.o,[e.ElementRef,e.Renderer2,[8,null]],{value:[0,"value"]},null),e["\u0275did"](23,147456,null,0,o.x,[e.ElementRef,e.Renderer2,[8,null]],{value:[0,"value"]},null),(l()(),e["\u0275ted"](-1,null,["All"])),(l()(),e["\u0275and"](16777216,null,null,1,null,L)),e["\u0275did"](26,802816,null,0,p.i,[e.ViewContainerRef,e.TemplateRef,e.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),e["\u0275eld"](27,0,null,null,4,"div",[["class","col-sm-6"]],null,null,null,null,null)),(l()(),e["\u0275eld"](28,0,null,null,1,"button",[["class","btn btn-secondary "],["type","button"]],null,[[null,"click"]],function(l,n,t){var e=!0;return"click"===n&&(e=!1!==l.component.calculate()&&e),e},null,null)),(l()(),e["\u0275ted"](-1,null,["Calculate "])),(l()(),e["\u0275eld"](30,0,null,null,1,"button",[["class","btn btn-secondary"],["type","button"]],null,[[null,"click"]],function(l,n,t){var e=!0;return"click"===n&&(e=!1!==l.component.excelExport()&&e),e},null,null)),(l()(),e["\u0275ted"](-1,null,["Download"])),(l()(),e["\u0275eld"](32,0,null,null,1,"jqxDataTable",[],null,null,null,c.b,c.a)),e["\u0275did"](33,13221888,[[2,4],["myDataTable",4]],0,g.a,[e.ElementRef],{attrAltRows:[0,"attrAltRows"],attrColumns:[1,"attrColumns"],attrColumnsResize:[2,"attrColumnsResize"],attrEditable:[3,"attrEditable"],attrFilterable:[4,"attrFilterable"],attrFilterMode:[5,"attrFilterMode"],attrPageable:[6,"attrPageable"],attrPagerButtonsCount:[7,"attrPagerButtonsCount"],attrSource:[8,"attrSource"],attrSortable:[9,"attrSortable"],attrSelectionMode:[10,"attrSelectionMode"],attrWidth:[11,"attrWidth"]},null)],function(l,n){var t=n.component;l(n,4,0,"Hasil Rute","fa-table"),l(n,7,0,"Please wait for about 30 minutes...",300,70),l(n,22,0,"all"),l(n,23,0,"all"),l(n,26,0,t.gudangList),l(n,33,1,[!0,t.columns,!0,!1,!0,"simple",!0,10,t.dataAdapter,!1,"singleRow","100%"])},function(l,n){l(n,2,0,void 0)})}var w=e["\u0275ccf"]("app-hasil",x,function(l){return e["\u0275vid"](0,[(l()(),e["\u0275eld"](0,0,null,null,1,"app-hasil",[],null,null,null,C,R)),e["\u0275did"](1,114688,null,0,x,[m.a,h.a,b,v.a],null,null)],function(l,n){l(n,1,0)},null)},{},{},[]),D=t("OYiS"),k=t("t/Na"),S=t("ebCm"),j=t("ZYCi"),F=function(){},T=t("+Sv0"),M=t("iKbT"),E=t("A7o+"),A=t("C9m0"),G=t("Tx//"),I=t("uswQ");t.d(n,"HasilModuleNgFactory",function(){return O});var O=e["\u0275cmf"](a,[],function(l){return e["\u0275mod"]([e["\u0275mpd"](512,e.ComponentFactoryResolver,e["\u0275CodegenComponentFactoryResolver"],[[8,[u.a,w,D.a]],[3,e.ComponentFactoryResolver],e.NgModuleRef]),e["\u0275mpd"](4608,p.l,p.k,[e.LOCALE_ID,[2,p.r]]),e["\u0275mpd"](4608,k.h,k.n,[p.c,e.PLATFORM_ID,k.l]),e["\u0275mpd"](4608,k.o,k.o,[k.h,k.m]),e["\u0275mpd"](5120,k.a,function(l){return[l]},[k.o]),e["\u0275mpd"](4608,k.k,k.k,[]),e["\u0275mpd"](6144,k.i,null,[k.k]),e["\u0275mpd"](4608,k.g,k.g,[k.i]),e["\u0275mpd"](6144,k.b,null,[k.g]),e["\u0275mpd"](4608,k.f,k.j,[k.b,e.Injector]),e["\u0275mpd"](4608,k.c,k.c,[k.f]),e["\u0275mpd"](4608,o.v,o.v,[]),e["\u0275mpd"](4608,S.a,S.a,[]),e["\u0275mpd"](1073742336,p.b,p.b,[]),e["\u0275mpd"](1073742336,j.o,j.o,[[2,j.u],[2,j.l]]),e["\u0275mpd"](1073742336,F,F,[]),e["\u0275mpd"](1073742336,T.a,T.a,[]),e["\u0275mpd"](1073742336,k.e,k.e,[]),e["\u0275mpd"](1073742336,k.d,k.d,[]),e["\u0275mpd"](1073742336,M.a,M.a,[]),e["\u0275mpd"](1073742336,E.g,E.g,[]),e["\u0275mpd"](1073742336,A.a,A.a,[]),e["\u0275mpd"](1073742336,o.s,o.s,[]),e["\u0275mpd"](1073742336,o.g,o.g,[]),e["\u0275mpd"](1073742336,G.a,G.a,[]),e["\u0275mpd"](1073742336,a,a,[]),e["\u0275mpd"](1024,j.j,function(){return[[{path:"",component:x}],[{path:"",component:I.a,children:[{path:"",redirectTo:"dashboard",pathMatch:"prefix"},{path:"dashboard",loadChildren:"./dashboard/dashboard.module#DashboardModule"},{path:"data",loadChildren:"./data/data.module#DataModule"},{path:"hasil",loadChildren:"./hasil/hasil.module#HasilModule"},{path:"download",loadChildren:"./download/download.module#DownloadModule"},{path:"pengaturan",loadChildren:"./pengaturan/pengaturan.module#PengaturanModule"},{path:"pengujian",loadChildren:"./pengujian/pengujian.module#PengujianModule"},{path:"setting",loadChildren:"./setting/setting.module#SettingModule",resolve:{data:M.b}}]}]]},[]),e["\u0275mpd"](256,k.l,"XSRF-TOKEN",[]),e["\u0275mpd"](256,k.m,"X-XSRF-TOKEN",[])])})}}]);
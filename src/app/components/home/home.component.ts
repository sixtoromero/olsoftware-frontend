import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general.service';

import { CustomerService } from 'src/app/services/customer.service';
import { ProjectService } from 'src/app/services/project.service';
import { CustomerModel } from 'src/app/models/customer.model';
import { ProjectModel } from 'src/app/models/project.model';
import { InfoProjectModel } from 'src/app/models/infoproject.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CustomerService, ProjectService, GeneralService, MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {

  msgs: Message[] = [];

  //publiInfoProjects: InfoProjectModel[] = [];
  results: InfoProjectModel[] = [];  
  project: ProjectModel;
  customers: CustomerModel[] = [];

  selectInfoPro: InfoProjectModel;

  displayModal: boolean = false;
  isNew: boolean = true;
  
  public myForm: FormGroup  = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,  
    private projectService: ProjectService,
    private general: GeneralService,    
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService
  ) { 

    this.myForm = fb.group({
      CustomerId: ['', [Validators.required]],
      ProjectName: ['', [Validators.required]],
      Phone: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],      
      EndDate: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      NumberHours: ['', [Validators.required]],
      Status: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {    
    this.getAllCustomer();
    this.getProjectInfoAsync();
  }

  get f() {
    return this.myForm.controls;
  }

  insertOrupdate(){
    if (this.isNew){
      this.insert();
    } else {
      this.update();
    }
  }

  insert() {
    this.ngxService.start();
    const model = this.prepareSave();    
    model.Id = 0;
    this.projectService.insert(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.displayModal = false; 
        this.getProjectInfoAsync();
        this.general.showSuccess('registrado exitosamente');
      } else {
        this.general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  update() {
    this.ngxService.start();
    const model = this.prepareSave();    
    this.projectService.update(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.displayModal = false;         
        this.getProjectInfoAsync();
        this.general.showSuccess('Actualizado exitosamente');        
      } else {
        this.general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getProjectInfoAsync() {
    this.ngxService.start();
    this.projectService.getProjectInfo()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      console.log('Respuesta', response);
      if (response["IsSuccess"]) {
        this.results = response["Data"] as InfoProjectModel[];
      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getAllCustomer() {
    this.ngxService.start();
    this.customerService.getAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      console.log('Respuesta', response);
      if (response["IsSuccess"]) {
        this.customers = response["Data"] as CustomerModel[];
        console.log('Customer', this.customers);
      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  deleteCorrespondence(Id: number){
    this.ngxService.start();
    this.customerService.delete(Id)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {      
      if (response["IsSuccess"]) {        
        this.general.showSuccess("Se ha eliminado el registro correctamente.");
        this.getProjectInfoAsync();
      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  confirmDelete(Id: number) {
    this.confirmationService.confirm({
        message: 'Está seguro de eliminar el registro seleccionado?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteCorrespondence(Id);
        }
    });
  }

  editModal(Id: number) {

    this.ngxService.start();
    this.projectService.getById(Id)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      console.log('Respuesta', response);
      if (response["IsSuccess"]) {

        this.project = response["Data"] as ProjectModel;

        //this.selectInfoPro = item;
        this.displayModal = true;
        this.isNew = false;

        debugger;

        this.f.CustomerId.setValue(this.project.CustomerId);
        this.f.ProjectName.setValue(this.project.ProjectName);
        this.f.Phone.setValue(this.project.Phone);
        this.f.Price.setValue(this.project.Price);
        this.f.NumberHours.setValue(this.project.NumberHours);
        //this.f.StartDate.setValue(this.project.StartDate);
        //this.f.EndDate.setValue(this.project.EndDate);        
        this.f.Status.setValue(this.project.Status);        

      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });

    

  }

  private prepareSave(): ProjectModel {
    return new ProjectModel().deserialize(this.myForm.value);
  }



}

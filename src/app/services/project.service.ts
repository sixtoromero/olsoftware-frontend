import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseModel } from '../models/response.model';
import { ProjectModel } from '../models/project.model';
import { InfoProjectModel } from '../models/infoproject.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Contend-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    
    endPoint = `${environment.apiURL}/Project`;
    endPointInfo = `${environment.apiURL}/Info`;

    constructor(private _http: HttpClient) { }

    getProjectInfo(): Observable<Observable<ResponseModel<InfoProjectModel[]>>> {
        return this._http.get<Observable<ResponseModel<InfoProjectModel[]>>>(`${this.endPointInfo}/GetProjectInfoAsync` );
    }

    getById(Id: number): Observable<Observable<ResponseModel<ProjectModel>>> {        
        return this._http.get<Observable<ResponseModel<ProjectModel>>>(`${this.endPoint}/GetAsync/${Id}` );
    }

    insert(model: ProjectModel): Observable<Observable<ResponseModel<string>>> {
        return this._http.post<Observable<ResponseModel<string>>>(`${this.endPoint}/InsertAsync`, model, httpOptions);
    }

    update(model: ProjectModel): Observable<Observable<ResponseModel<string>>> {
        return this._http.put<Observable<ResponseModel<string>>>(`${this.endPoint}/UpdateAsync`, model, httpOptions);
    }

    delete(Id: number): Observable<Observable<ResponseModel<string>>> {
        return this._http.delete<Observable<ResponseModel<string>>>(`${this.endPoint}/DeleteAsync/${Id}`, httpOptions);
    }

}
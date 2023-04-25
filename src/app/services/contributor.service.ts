import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contributor } from '../models/contributor';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {

  psServer: string = "http://localhost:3000"
  psModelo: string = "contributors"


  constructor(private http:HttpClient) { }

  getContributor(){
    return this.http.get<Contributor[]>(this.psServer+"/"+this.psModelo);
  }

  addContributor(contributor:Contributor){
    return this.http.post<Contributor>(this.psServer+"/"+this.psModelo,contributor);
  }
}

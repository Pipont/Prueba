import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contributor } from 'src/app/models/contributor';
import { ContributorService } from 'src/app/services/contributor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  psDataSource = new MatTableDataSource<Contributor>();
  psColumnsTable = ["id","name","ruc","amount","tax"]

  constructor(private contributorService: ContributorService){}

  ngOnInit(){ //
    this.getDataContributors();
  }

  calculateTax(taxableAmount: number):number{
    let psUIT = 4950;
    let  psAUX = taxableAmount/psUIT;
    let psTotalTax = 0;
    if(psAUX>=0 && psAUX<=5){
      psTotalTax = this.calculateTramo(psAUX,1)
    } else if (psAUX > 5 && psAUX < 20){
      psTotalTax = this.calculateTramo(5,1)+this.calculateTramo(psAUX-5,2)
    } else if (psAUX >= 20 && psAUX < 35){
      psTotalTax = this.calculateTramo(5,1)+this.calculateTramo(15,2)+this.calculateTramo(psAUX-20,3)
    } else if (psAUX >= 35 && psAUX < 45){
      psTotalTax = this.calculateTramo(5,1)+this.calculateTramo(15,2)+this.calculateTramo(15,3)+this.calculateTramo(psAUX-35,4)   
    } else if (psAUX >= 45){
      psTotalTax = this.calculateTramo(5,1)+this.calculateTramo(15,2)+this.calculateTramo(15,3)+this.calculateTramo(10,4) + this.calculateTramo(psAUX-45,5)
    }
    return psTotalTax
  }

  calculateTramo(x: number, tr: number): number{
    const pUIT = 4950
    const psTramos = [0.08,0.14,0.17,0.20,0.30]
    return x * pUIT * psTramos[tr-1];
  }

  getDataContributors():void{
    this.contributorService.getContributor().subscribe({
      next: (data:Contributor[]) => {
        this.psDataSource = new MatTableDataSource(data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}

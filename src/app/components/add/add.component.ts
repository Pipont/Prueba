import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Contributor } from 'src/app/models/contributor';
import { ContributorService } from 'src/app/services/contributor.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  myForm !: FormGroup;
  psid !: number;
  pstax !: number;



  constructor(private formBuilder:FormBuilder, private contributorService:ContributorService,
    private router:Router, private activatedRouter: ActivatedRoute, private snackBar: MatSnackBar){

      
    }

    ngOnInit(){
      this.generateReactiveForm()
    }

    generateReactiveForm():void{
      this.myForm=this.formBuilder.group({
        id:[""],
        name:["",[Validators.required,Validators.maxLength(40)]],
        ruc: ["",[Validators.required, Validators.maxLength(11)]],
        ammount:["",[Validators.required]],
        tax:[""]
      });
      this.psid=0;
    }

    addContributor():void{
      const contributor:Contributor={
        psid: this.psid,
        psname: this.myForm.get("name")!.value,
        psrucContributor: this.myForm.get("ruc")!.value,
        pstaxableAmmount: parseFloat(this.myForm.get("ammount")!.value)
      }
      if(this.psid!=undefined){
        this.contributorService.addContributor(contributor).subscribe({
          next: (data)=>{
            this.router.navigate([""]);
          },
          error: (err)=>{
            console.log(err);
          }
          })
      }
    }

    backHome(){
      this.router.navigate([""])
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

    calculateCtax(event:Event){
      let pskey = parseFloat((event.target as HTMLInputElement).value)
      this.pstax = this.calculateTax(pskey);
    }


}

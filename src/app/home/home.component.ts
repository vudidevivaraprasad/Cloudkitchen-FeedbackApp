import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Feedbackdata, firebaseConfig, formpropertiesdata } from '../environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Feedback';
    numberofstars:{[key:string]:boolean} = {
      '1':false,
      '2':false,
      '3':false,
      '4':false,
      '5':false
    }
    keys = Object.keys(this.numberofstars)

    submitdata:Feedbackdata = {} as Feedbackdata
    error:string = ''
    menuerr:boolean = false
    submitted:boolean = false

    menu:formpropertiesdata['data']['menu'] | undefined = []
    flavour:formpropertiesdata['data']['flavour'] | undefined = {}

    constructor(private firebase: FirebaseService) {
      firebase.getfeeddbackformproperties().then(data => {
        this.menu=data?.data.menu
        this.flavour=data?.data.flavour
      });
    }

    starclick(value:string) {
      this.submitdata.rating = Number(value)
      this.keys.forEach(key => this.numberofstars[key]=false)
      let intvalue:number = Number(value);
      while(intvalue >  0){
        this.numberofstars[String(intvalue)] = true
        intvalue -= 1
      }
    }
    flavourclick() {

    }

    submit(){
      if(Object.keys(this.submitdata).length != 4){
        this.error = 'Please fill all the details'
      }else{
        this.error = ''
        console.log('formdata',this.submitdata)
        this.firebase.addFeedback(this.submitdata)
          .then(data => this.submitted = true)
          .catch(e => console.error(e))
      }
    }
}

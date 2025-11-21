export const firebaseConfig = {
  apiKey: "AIzaSyCpmjpjcVuetXrbKBG32f7DDklThgsnoks",
  authDomain: "cloudkitchen-feedback.firebaseapp.com",
  projectId: "cloudkitchen-feedback",
  storageBucket: "cloudkitchen-feedback.firebasestorage.app",
  messagingSenderId: "508593185744",
  appId: "1:508593185744:web:df967934c19dc4322fcfd5",
  measurementId: "G-QSEYMNEZK3"
};

export interface Feedbackdata{
  menu:string,
  flavour:string,
  rating:number,
  feedback:string
}

export interface formpropertiesdata{
  data:{
    menu:string[],
    flavour:{[key:string]:string[]}
  }
}

export interface firebasefeedbackdata{
  menu:string,
  flavour:string,
  rating:number,
  feedback:string,
  date:number
}

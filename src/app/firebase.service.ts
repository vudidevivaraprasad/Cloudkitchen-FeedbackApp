import { Injectable } from '@angular/core';
import {initializeApp} from 'firebase/app';
import {Feedbackdata, firebaseConfig, formpropertiesdata} from 'src/app/environment'
import { getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app = initializeApp(firebaseConfig)
  private db = getFirestore(this.app)

  constructor() { }

  addFeedback(data:Feedbackdata){
    const feedbackRef = collection(this.db, "feedbacks");
    return addDoc(feedbackRef, {...data,date:Date.now()});
  }
  async getFeedbacks() {
    const feedbackRef = collection(this.db, "feedbacks");
    const snapshot = await getDocs(feedbackRef);
    console.log('Feedbacks data',snapshot)
  }
  async getfeeddbackformproperties():Promise<formpropertiesdata | null> {
    const feedbackRef = collection(this.db, "itemsdata");
    const snap = await getDocs(feedbackRef);
    if (snap.empty) {
      console.log('Collection is empty');
      return null;
    }

  // Since you have only 1 document, return the first one
    const docData = snap.docs[0].data();
    console.log("Item data:", docData);

    return docData as formpropertiesdata;
  }

}

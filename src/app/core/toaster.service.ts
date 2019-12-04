import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    constructor(private _toastCtrl: ToastController) {
    }

    async presentToast(message: string) {
        const toast = await this._toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
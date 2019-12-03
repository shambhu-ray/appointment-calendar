import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private _isLoading = false;

    constructor(private _loadingCtrl: LoadingController) {
    }

    public async presentLoading() {
        this._isLoading = true;
        return await this._loadingCtrl.create({
            message: 'Please wait...',
            translucent: true,
        }).then(loader => {
            loader.present().then(() => {
                if (!this._isLoading) {
                    loader.dismiss();
                }
            })
        });
    }

    public async dismiss() {
        this._isLoading = false;
        return await this._loadingCtrl.dismiss();
    }

}

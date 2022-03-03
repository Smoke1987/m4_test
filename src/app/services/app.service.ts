import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private spinnerRef: OverlayRef = this.cdkSpinnerCreate();

    constructor(
        private overlay: Overlay,
    ) {}

    showAlert(options: SweetAlertOptions): void {
        Swal.fire(options);
    }

    private cdkSpinnerCreate() {
        return this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'dark-backdrop',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
        })
    }

    showSpinner() {
        this.spinnerRef.attach(new ComponentPortal(MatSpinner));
    }

    stopSpinner() {
        this.spinnerRef.detach();
    }

}

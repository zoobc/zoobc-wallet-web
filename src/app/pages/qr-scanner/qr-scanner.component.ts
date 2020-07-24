import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevice = true;

  constructor(private dialogRef: MatDialogRef<QrScannerComponent>, private router: Router) {}

  ngOnInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      if (this.availableDevices.length <= 0) return (this.hasDevice = false);
      const defaultCamera = this.availableDevices.filter(d => {
        if (d.label.toLocaleLowerCase().includes('back')) return d;
      });
      if (defaultCamera && defaultCamera.length > 0) this.currentDevice = defaultCamera[0];
      else this.currentDevice = this.availableDevices[0];
    });
  }

  onCodeResult(resultString: string) {
    let json = JSON.parse(resultString);
    const address = json.address;
    const amount = json.amount;

    this.router.navigateByUrl('/request/' + address + '/' + amount + '');
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}

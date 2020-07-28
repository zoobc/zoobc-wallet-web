import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  subscription: Subscription;
  constructor(
    private dialogRef: MatDialogRef<QrScannerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: 'json' | 'string'
  ) {}

  ngOnInit() {
    this.subscription = this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      const defaultCamera = this.availableDevices.filter(d => {
        if (d.label.toLocaleLowerCase().includes('back')) return d;
      });
      if (defaultCamera && defaultCamera.length > 0) this.currentDevice = defaultCamera[0];
      else this.currentDevice = this.availableDevices[0];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCodeResult(resultString: string) {
    let result: any;
    if (this.data == 'string') result = resultString.split('||');
    else result = JSON.parse(resultString);
    this.dialogRef.close(result);
  }

  onClose() {
    this.currentDevice = null;
    navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
      const stream = mediaStream;
      const tracks = stream.getTracks();
      tracks[0].stop();
      this.dialogRef.close();
    });
  }

  onSwitch() {
    const curIndex = this.availableDevices.findIndex(dvc => dvc.deviceId == this.currentDevice.deviceId);
    if (curIndex == this.availableDevices.length - 1) this.currentDevice = this.availableDevices[0];
    else this.currentDevice = this.availableDevices[curIndex + 1];
  }
}

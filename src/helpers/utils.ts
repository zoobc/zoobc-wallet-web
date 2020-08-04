import { SendMoneyInterface } from 'zoobc-sdk';
import { ValidationErrors, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export function onCopyText(text: string) {
  let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  let selBox = document.createElement('textarea');
  let range = document.createRange();
  let selection;
  selBox.style.position = 'fixed';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  if (isiOSDevice) {
    range.selectNodeContents(selBox);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    selBox.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.
  }
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function truncate(num: number, places: number): number {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

export function calcMinFee(data: SendMoneyInterface) {
  const blockPeriod = 10 * 1e8;
  const feePerBlockPeriod = 0.01 * 1e8;

  if (data.timeout) {
    return (Math.ceil((data.timeout * 1e8) / blockPeriod) * feePerBlockPeriod) / 1e8;
  } else return feePerBlockPeriod / 1e8;
}

export function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toUpperCase();
}

export function uniqueParticipant(formArray: FormArray): ValidationErrors {
  const values = formArray.value.filter(val => val.length > 0);
  const controls = formArray.controls;
  const result = values.some((element, index) => {
    return values.indexOf(element) !== index;
  });
  const invalidControls = controls.filter(ctrl => ctrl.valid === false);
  if (result && invalidControls.length == 0) {
    return { duplicate: true };
  }
  return null;
}

export function getTranslation(
  value: string,
  translateService: TranslateService,
  interpolateParams?: Object
) {
  let message: string;
  translateService.get(value, interpolateParams).subscribe(res => {
    message = res;
  });
  return message;
}

export function stringToBuffer(str: string) {
  return Buffer.from(str, 'base64');
}

export function jsonBufferToString(buf: any) {
  if (!buf) return '';
  try {
    return Buffer.from(buf.data, 'base64').toString('base64');
  } catch (error) {
    return buf.toString('base64');
  }
}

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

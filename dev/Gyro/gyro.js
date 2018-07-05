const elDebug = document.querySelector('#debug');

window.addEventListener(
  'deviceorientation',
  deviceOrientationHandler);

/** デバイスが傾いたときのイベントです。 */
function deviceOrientationHandler(event) {
  //ジャイロセンサー情報取得
  // X軸
  const beta = event.beta;
  // Y軸
  const gamma = event.gamma;
  // Z軸
  const alpha = event.alpha;

  // ログを出力する
  let html = ``;
  html += 'X回転 : ' + beta + '<br />';
  html += 'Y回転 : ' + gamma + '<br />';
  html += 'Z回転 : ' + alpha;
  elDebug.innerHTML = html;
}

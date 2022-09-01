
(() => {
  window.isKeyDown = {};
  window.isMouseDown = {};

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;
  let util = null;
  let canvas = null;
  let ctx = null;

  let main_field = null;
  let startTime = 0;

  window.addEventListener('load', () => {
    // ユーティリティクラスを初期化
    util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
    canvas = util.canvas;
    ctx = util.context;

    // 初期化処理を行う
    initialize();
    // インスタンスの状態を確認する
    loadCheck();

  }, false);

  // initialize
  function initialize(){
    // canvas の大きさを設定
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    startTime = Date.now();


    main_field = new Field(util);
    eventSetting();
  }

  function loadCheck(){
    render();
  }

  function eventSetting(){
    window.addEventListener('keydown', (event) => {
        isKeyDown[`key_${event.key}`] = true;
        console.log(`key_${event.key}`);
    }, false);

    window.addEventListener('keyup', (event) => {
        isKeyDown[`key_${event.key}`] = false;
    }, false);

    window.addEventListener('mousedown', (event) => {
        let rect = canvas.getBoundingClientRect();
        isMouseDown[`mouse_${event.button}`] = true;
        isMouseDown[`mouse_${event.button}_x`] = event.clientX - rect.left;
        isMouseDown[`mouse_${event.button}_y`] = event.clientY - rect.top;

        //console.log(`mouse_${event.button}`);
        //console.log(isMouseDown[`mouse_${event.button}_x`]);
        //console.log(isMouseDown[`mouse_${event.button}_y`]);
    }, false);

    window.addEventListener('mouseup', (event) => {
        isMouseDown[`mouse_${event.button}`] = false;
        //isMouseDown[`mouse_${event.button}_x`] = -1;
        //isMouseDown[`mouse_${event.button}_y`] = -1;
    }, false);
  }

  function render(){
    // グローバルなアルファを必ず 1.0 で描画処理を開始する
    ctx.globalAlpha = 1.0;
    // 描画前に画面全体を不透明な明るいグレーで塗りつぶす
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    // 現在までの経過時間を取得する（ミリ秒を秒に変換するため 1000 で除算）
    let nowTime = (Date.now() - startTime) / 1000;

    main_field.update();

    requestAnimationFrame(render);
  }

})();

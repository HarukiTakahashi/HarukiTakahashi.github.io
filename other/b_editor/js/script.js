
(() => {
  window.isKeyDown = {};
  window.isMouseDown = {};
  window.isMouseMove = {};

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;
  let util = null;
  let canvas = null;
  let ctx = null;

  let main_field = null;
  let startTime = 0;

  window.addEventListener('load', () => {
    util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
    canvas = util.canvas;
    ctx = util.context;

    initialize();
    loadCheck();

  }, false);

  // initialize
  function initialize(){
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

    document.getElementById('random_button').addEventListener('click', () => {
        main_field.randomize();
    });
    document.getElementById('grid_size_num').addEventListener('change', () => {
        main_field.changeGridNum();
    });

    document.getElementById('rg_button').addEventListener('click', () => {
        main_field.resetRandG();
    });
    document.getElementById('all_button').addEventListener('click', () => {
      main_field.reset();
  });
    
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

        console.log(`mouse_${event.button}`);
        console.log(isMouseDown[`mouse_${event.button}_x`]);
        console.log(isMouseDown[`mouse_${event.button}_y`]);
    }, false);

    window.addEventListener('mouseup', (event) => {
        isMouseDown[`mouse_${event.button}`] = false;
        //isMouseDown[`mouse_${event.button}_x`] = -1;
        //isMouseDown[`mouse_${event.button}_y`] = -1;
        isMouseMove[`mouse_${event.button}`] = false;
    }, false);

    window.addEventListener('mousemove', (event) => {
      isMouseMove[`mouse_${event.button}`] = true;

      let rect = canvas.getBoundingClientRect();
      isMouseMove[`mouse_${event.button}_x`] = event.clientX - rect.left;
      isMouseMove[`mouse_${event.button}_y`] = event.clientY - rect.top;
      //console.log(`mouse_${event.button}`);
  }, false);
  }

  function render(){
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    let nowTime = (Date.now() - startTime) / 1000;

    main_field.update();
    requestAnimationFrame(render);
  }

})();

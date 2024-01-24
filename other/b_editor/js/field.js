class Field{

  constructor(util){
    this.util = util;
    this.size = 4;
    this.grid_size_w = this.util.canvas.width / this.size;
    this.grid_size_h = this.util.canvas.height / this.size;

    this.array_r = [];
    this.array_g = [];
    this.array_b = [];
    this.putflag = true;
    this.resizeflag = false;
    this.grid_visibility = true;

    this.reset();
  }

  update(){
    this.put();
    this.draw();

    if(window.isKeyDown.key_Enter === false && this.resizeflag == true){
      //this.resize(this.size + 2);
      this.reset();
      this.resizeflag = false;
    }
    else if(window.isKeyDown.key_Enter === true){
      this.resizeflag = true;
    }
  }

  randomize(){
    //console.log("randomize!");
    let min = Number(document.getElementById('rg_min').value);
    let max = Number(document.getElementById('rg_max').value);

    for(let i = 0; i < this.size; i++){
      for(let j = 0; j < this.size; j++){
        let r = Math.floor( Math.random() * (max - min) ) + min;
        let g = Math.floor( Math.random() * (max - min) ) + min;

        this.array_r[i][j] = r;
        this.array_g[i][j] = g;
      }
    }
  }

  resetRandG(){
    //console.log("reset r and g!");

    for(let i = 0; i < this.size; i++){
      for(let j = 0; j < this.size; j++){
        this.array_r[i][j] = 0;
        this.array_g[i][j] = 0;
      }
    }
  }

  changeGridNum(){
    console.log("change");
    this.reset();
  }

  rgb2hex ( rgb ) {
    return "#" + rgb.map( function ( value ) {
      return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
    } ).join( "" ) ;
  }

  reset(){
    let elem = document.getElementById('grid_size_num');
    this.size = Number(elem.value);

    this.grid_size_w = this.util.canvas.width / this.size;
    this.grid_size_h = this.util.canvas.height / this.size;

    this.array_r = new Array(this.size);
    this.array_g = new Array(this.size);
    this.array_b = new Array(this.size);

    for(let y = 0; y < this.size; y++) {
      this.array_r[y] = new Array(this.size).fill(0);
      this.array_g[y] = new Array(this.size).fill(0);
      this.array_b[y] = new Array(this.size).fill(0);
    }
  }

  put(){
    
    //if(window.isMouseDown.mouse_0 === false && this.putflag == true){
    if(window.isMouseMove.mouse_0 === true && window.isMouseDown.mouse_0 === true){
      let posx = window.isMouseMove.mouse_0_x;
      let posy = window.isMouseMove.mouse_0_y;

      if(posx < 0 || posx > this.util.canvas.width || posy < 0 || posy > this.util.canvas.height){
        return;
      }

      let x = posx / this.grid_size_w | 0;
      let y = posy / this.grid_size_h | 0;

      this.array_b[x][y] = 255;

      return 1;
    }

    if(window.isMouseDown.mouse_0 === true){
      this.putflag = true;
    }
  }

  draw(){
    //console.log("!!");
    let w = this.util.canvas.width;
    let h = this.util.canvas.height;
    this.util.context.globalAlpha = 1.0;
    //this.util.drawRect(0, 0, w, h, '#00FF00');

    let r = this.array_r;
    let g = this.array_g;
    let b = this.array_b;

    for(let i = 0; i < this.size; i++){
      for(let j = 0; j < this.size; j++){
        let x = i * this.grid_size_w;
        let y = j * this.grid_size_h;
        let grid_color = this.rgb2hex([r[i][j],g[i][j],b[i][j]]);

        this.util.context.globalAlpha = 1.0;
        this.util.drawRect(x, y, this.grid_size_w, this.grid_size_h, grid_color,3)

      }
    }

    if(this.grid_visibility){
    let grid_line_color = this.rgb2hex([255,255,0]);

    for(let i = 0; i <= this.size; i++){
      let x = i * this.grid_size_w;
      this.util.drawLine(x, 0, x, h , grid_line_color, 2);
    }
    for(let i = 0; i <= this.size; i++){
      let y = i * this.grid_size_h;
      this.util.drawLine(0, y, w, y, grid_line_color, 2);
    }
  }
  }
}

class Field{

  constructor(util){
    this.util = util;
    this.size = 8;
    this.grid_size_w = this.util.canvas.width / this.size;
    this.grid_size_h = this.util.canvas.height / this.size;
    this.turn = 1;

    this.array = [];
    this.array_cand = [];

    this.putflag = false;
    this.resizeflag = false;
    this.loadflag = true;

    this.reset();
    this.load();
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

  load(){
    let field_data = localStorage.getItem('reversi_field_data');
    let turn_data = localStorage.getItem('reversi_turn_data');
    if(field_data != null && turn_data != null){
      this.array = JSON.parse(field_data);
      this.turn = JSON.parse(turn_data);
      this.size = this.array.length;
      this.update_cand(this.turn);
    }else{
      console.log("no save data");
    }
  }

  randomize(){
    console.log("randomize!");
  }

  save(){
    let field_data_json = JSON.stringify(this.array);
    let turn_data_json = JSON.stringify(this.turn);
    localStorage.setItem('reversi_field_data', field_data_json);
    localStorage.setItem('reversi_turn_data',turn_data_json);
  }

  resize(size){

    if(size <= this.size || size % 2 != 0){
      return;
    }
    let num = (size - this.size) / 2;

    for(let y = 0; y < this.size; y++) {
      this.array[y].unshift(0);
      this.array[y].push(0);
      this.array_cand[y].unshift(0);
      this.array_cand[y].push(0);
    }

    for(let i = 0; i < num; i++){
      this.array.unshift(new Array(this.size).fill(0));
      this.array.push(new Array(this.size).fill(0));
      this.array_cand.unshift(new Array(this.size).fill(0));
      this.array_cand.push(new Array(this.size).fill(0));
    }
    //console.log(num);
    //console.log(this.array);

    this.size = size;
    this.grid_size_w = this.util.canvas.width / this.size;
    this.grid_size_h = this.util.canvas.height / this.size;
    this.update_cand(this.turn);
  }

  reset(){
    this.array = new Array(this.size);
    let a = this.array;
    for(let y = 0; y < this.size; y++) {
      a[y] = new Array(this.size).fill(0);
    }
    this.array_cand = new Array(this.size);
    for(let y = 0; y < this.size; y++) {
      this.array_cand[y] = new Array(this.size).fill(0);
    }

    let pos = a.length / 2;
    a[pos-1][pos-1] = 1;
    a[pos][pos-1] = -1;
    a[pos-1][pos] = -1;
    a[pos][pos] = 1;
    this.turn = 1;
    this.update_cand(this.turn);
  }

  put(){
    if(window.isMouseDown.mouse_0 === false && this.putflag == true){
      this.putflag = false;
      let posx = window.isMouseDown.mouse_0_x;
      let posy = window.isMouseDown.mouse_0_y;

      if(posx < 0 || posx > this.util.canvas.width || posy < 0 || posy > this.util.canvas.height){
        return;
      }

      let x = posx / this.grid_size_w | 0;
      let y = posy / this.grid_size_h | 0;

      //console.log(x + " " + y);

      if(this.array[x][y] != 0){
        return -1;
      }

      let start = this.turn;

      let c = this.allcheck(start,x,y);
      //console.log("c: " + c);
      if(c <= 0){
        return -1;
      }

      this.array[x][y] = this.turn;
      this.turn = this.turn * -1;
      this.reverse(x,y);
      this.update_cand(this.turn);

      this.save();
      return 1;
    }

    if(window.isMouseDown.mouse_0 === true){
      this.putflag = true;
    }
  }

  allcheck(tar,x,y){
    let c = this.check(tar,x,y,-1,0)
    +this.check(tar,x,y, 1,0)
    +this.check(tar,x,y, 0,-1)
    +this.check(tar,x,y, 0,1)
    +this.check(tar,x,y,-1,-1)
    +this.check(tar,x,y,-1,1)
    +this.check(tar,x,y, 1,1)
    +this.check(tar,x,y, 1,-1);
    return c;
  }

  update_cand(tar){
    for(let y = 0; y < this.size; y++) {
      this.array_cand[y] = new Array(this.size).fill(0);
    }
    let a = this.array_cand;
    for(let j = 0; j < a.length; j++){
      for(let i = 0; i < a[j].length; i++){
        if(this.array[i][j] == 1 || this.array[i][j] == -1){
          continue;
        }

        //console.log("CAND!");
        let c = this.allcheck(tar,i,j)
        if(c > 0){
          //console.log(tar + " " + i + " " + j + " " + c );
          a[i][j] = tar;
        }
      }
    }
  }

  reverse(x,y){
    let start = this.array[x][y];

    console.log(this.check(start,x,y,-1,0));

    let res = 0;
    res = this.check(start,x,y,-1,0);
    for (let j = 0; j <= res; j++)
      this.array[x+j*-1][y] = start;

    res = this.check(start,x,y, 1,0);
    for (let j = 0; j <= res; j++)
      this.array[x+j][y] = start;

    res = this.check(start,x,y, 0,-1);
    for (let j = 0; j <= res; j++)
      this.array[x][y+j*-1] = start;

    res = this.check(start,x,y, 0,1);
    for (let j = 0; j <=res; j++)
      this.array[x][y+j] = start;

    res = this.check(start,x,y, -1,-1);
    for (let j = 0; j <= res; j++)
      this.array[x+j*-1][y+j*-1] = start;

    res = this.check(start,x,y,-1,1)
    for (let j = 0; j <= res; j++)
      this.array[x+j*-1][y+j] = start;

    res = this.check(start,x,y, 1,1)
    for (let j = 0; j <= res; j++)
      this.array[x+j][y+j] = start;

    res = this.check(start,x,y, 1,-1)
    for (let j = 0; j <= res; j++)
      this.array[x+j][y+j*-1] = start;

  }

  check(tar,x,y,xd,yd){
//    console.log(tar +" "+ x + " " + y + " " + xd + " " + yd);
    let i = 1;
    let flag = false;
    while(true){
      if(x+i*xd >= this.size || x+i*xd < 0 || y+i*yd >= this.size || y+i*yd < 0)
      {
        flag = false;
        break;
      }
      if(this.array[x+i*xd][y+i*yd] == tar*-1){
        flag = true;
      }else{
        break;
      }
      i++;
    }

    if(!flag){
      return 0;
    }

    if (this.array[x+i*xd][y+i*yd] == tar) {
      //console.log("!!!" + tar + " i:" + i +" x:"+ x + " y:" + y + " " + xd + " " + yd);
      //console.log(this.array[x+i*xd][y+i*yd] );
      return i-1;
    } else {
      return 0;
    }
    return 0;
  }

  draw(){
    //console.log("!!");
    let w = this.util.canvas.width;
    let h = this.util.canvas.height;
    this.util.context.globalAlpha = 1.0;
    this.util.drawRect(0, 0, w, h, '#005500');

    //this.ctx.drawLine(0,0,0,100,'#000000',10);

    for(let i = 0; i <= this.size; i++){
      let x = i * this.grid_size_w;
      this.util.drawLine(x, 0, x, h , '#000000', 3);
    }
    for(let i = 0; i <= this.size; i++){
      let y = i * this.grid_size_h;
      this.util.drawLine(0, y, w, y, '#000000', 3);
    }

    let a = this.array;
    let ad = this.array_cand;
    for(let i = 0; i < a.length; i++){
      for(let j = 0; j < a[i].length; j++){
        let x = i * this.grid_size_w + this.grid_size_w / 2;
        let y = j * this.grid_size_h + this.grid_size_h /2;
        //console.log(i + " " + j + " " + a[i][j]);

        this.util.context.globalAlpha = 1.0;
        if(a[i][j] == 1){
          this.util.drawCircle(x, y, this.grid_size_w/2*0.8, '#000000')
        }
        else if(a[i][j] == -1){
          this.util.drawCircle(x, y, this.grid_size_w/2*0.8, '#ffffff')
        }

        this.util.context.globalAlpha = 0.2;
        if(ad[i][j] == 1){
          this.util.drawCircle(x, y, this.grid_size_w/2*0.5, '#000000')
        }
        else if(ad[i][j] == -1){
          this.util.drawCircle(x, y, this.grid_size_w/2*0.5, '#ffffff')
        }
      }
    }
  }
}

(() => {

    let gcode = [];
    let scene;
    let camera;

    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.setOptions({
        fontFamily: "consolas",
        fontSize: "12pt"
      });
    editor.on('change', function(e){
        console.log(e);
        draw_gcode_in_editor();
    });

    // ページの読み込みを待つ
    window.addEventListener('DOMContentLoaded', () => {

       init();
       localstorage_load();

    }, false);

    window.addEventListener('load', () => {
        const f = document.getElementById('load_file');
        f.addEventListener('change', evt => {
          const input = evt.target;
          const file = input.files[0];
          gcode = [];

          for (let i = 0; i < input.files.length; i++) {
            console.log(input.files[i]);
          }

          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function() {
            const res = reader.result;
            const arr = res.split(/\r\n|\n/);
            for (let i = 0; i < arr.length; i++) {
                //console.log(i + " " + arr[i]);
                g = new Gcode(arr[i]);
                gcode.push(g);   
            }
            drawGcode();

            editor.setValue(res);
          };
        });

        const sf = document.getElementById('save_file');
        sf.addEventListener('click', evt => {
            console.log("hi");
      
            const text = editor.getValue();
            const blob = new Blob([text], {type: 'text/plain'})
            const url = URL.createObjectURL(blob) // <1>
        
            const anchor = document.createElement('a')
            anchor.setAttribute('href', url)
            anchor.setAttribute('download', 'output.gcode') // <2>
        
            const mouseEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
        
            anchor.dispatchEvent(mouseEvent) // <3>
        });

      });



    function draw_gcode_in_editor(){
        let edi_g = editor.getValue();
        const arr = edi_g.split(/\r\n|\n/);
        gcode = [];
       
        for (let i = 0; i < arr.length; i++) {
            g = new Gcode(arr[i]);
            gcode.push(g);   
        }

        for (let i = 0; i < scene.children.length; i++) {
            console.log(scene.children[i]);
            if(scene.children[i]["type"] == 'Line'){
                scene.remove(scene.children[i]);
            }
        }

        console.log(scene.children);
        drawGcode();
        localstorage_save();
    }


    function init() {
        
        // サイズを指定
        const width = 960;
        const height = 540;

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#myCanvas')
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // シーンを作成
        scene = new THREE.Scene();

        // GridHelper
        const gridHelper = new THREE.GridHelper(400, 40);
        scene.add(gridHelper);
        // AxesHelper
        const axesHelper = new THREE.AxesHelper(200);
        axesHelper.setColors(new THREE.Color("rgb(0, 255, 0)"),
                            new THREE.Color("rgb(0, 0, 255)"),
                            new THREE.Color("rgb(255, 0, 0)"),
        );
        scene.add(axesHelper);

        // カメラを作成
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.set(-100, 100, 50);
        const controls = new THREE.OrbitControls(camera, document.querySelector('#myCanvas'));
        controls.target.set(100,0,50);
        controls.update();
        
        renderer.render(scene, camera);

        tick();
        function tick() {
            renderer.render(scene, camera);

            requestAnimationFrame(tick);
        }
    }

    function localstorage_load(){
        let gcode_data = localStorage.getItem('gcode_data');
        if(gcode_data != null){
            gcode = JSON.parse(gcode_data);
            editor.setValue(gcode);
        }else{
          console.log("no save data");
          
        }
      }

      function localstorage_save(){
        if(gcode.length < 1000){
            let edi_g = editor.getValue();
            let gcode_data = JSON.stringify(edi_g);
            localStorage.setItem('gcode_data', gcode_data);
            console.log("gcode saved");
        }else{
            console.log("too long gcode to save");
        }
      }
    
    function drawGcode(){
        if(gcode == undefined){
            return;
        }
        console.log("ready" + gcode.length);

        const points = [];
        x = 0;
        y = 0;
        z = 0;
        px = 0;
        py = 0;
        pz = 0;
        mode = 0; // 0: absolute 1: relative
        points.push(new THREE.Vector3(x, y, z));

        for(let i = 0; i < gcode.length; i++){
            let g = gcode[i];

            if(g.params['G'] != undefined){

                if(g.params['G'] == 90){
                    mode = 0;
                    continue;
                }
                if(g.params['G'] == 91){
                    mode = 1;
                    continue;
                }

                if(g.params['X'] != undefined) {
                    x = g.params['X'] + (px * mode);
                } else {
                    x = px;
                }
                if(g.params['Y'] != undefined) {
                    z = g.params['Y'] + (pz * mode);
                } else {
                    z = pz;
                }
                if(g.params['Z'] != undefined)  {
                    y = g.params['Z'] + (py * mode);
                } else {
                    y = py;
                }
                console.log(x,y,z)
                points.push(new THREE.Vector3(z, y, x));
                
                px = x;
                py = y;
                pz = z;
            }
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            linewidth: 5,
        } );
        const line = new THREE.Line(geometry, material);
        scene.add(line);

    }

}
)();
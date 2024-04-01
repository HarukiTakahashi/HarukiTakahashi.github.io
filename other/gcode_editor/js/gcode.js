class Gcode {
    constructor(str) {
        this.original = str;

        const arr = str.split(' ');
        this.params = {};
        for(let i = 0; i < arr.length; i++){
            const sp = arr[i];

            let num = 0;
            if(sp.length == 1){
                this.params[sp.charAt(0)] = 0;
                continue;
            }

            if(sp.slice(1,sp.length).indexOf('.') != 0){
                num = parseFloat(sp.slice(1,sp.length));
            }else{
                num = parseInt(sp.slice(1,sp.length));     
            }
            this.params[sp.charAt(0)] = num;
        }
    }


}
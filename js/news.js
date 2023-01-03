(function(){

  const outputElement = document.getElementById('output_news_data');

    outputElement.innerHTML = "started";
    getCsvData( '../news_posts.txt' );

  function getCsvData( dataPath )
  {
    var req = new XMLHttpRequest();
    req.open("get",dataPath,true);
    req.send();
    req.onload = function(){
      var loadText = req.responseText;

      var res = "";
      res+="<table class=\"table table-hover table-condensed\">";
      var lines = loadText.split(/\r\n|\n/);

      for (let i = 0; i < lines.length; i++){
    		if (lines[i] != ""){
          var tmp = lines[i].split(',');
          if(tmp[0]=="o"){
            res += "<tr class=\"\" style=\"display: table-row;\">";
          }else{
            res += "<tr class=\"hide_area\">";
          }
          res += "<td>"+tmp[2]+"</td>";
          if(tmp[1]=="JP"){
            res += "<td>JP</td>";
          }else{
              res += "<td></td>";
          }
          res += "<td>"+tmp[3]+"</td>";

          res += "</tr>"
    		}
    	}
      res += "</table>"
      outputElement.innerHTML = res;
      //let dat = convertCSVtoArray( req.responseText );
    }
}

})();

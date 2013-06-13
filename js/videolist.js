(function($){

  function insertPic(callback){
    $.getJSON('document.json')
      .success(function(data){
        callback(data);
      })
      .error(function(xhr, type){
        console.log('Error: ', type);
      });
  }

  // Забираем данные из json, вставляем превью видео
  insertPic(function(data){
    var videos = data.video,
        videoLength = videos.length,
        i = 0,
        code = '';

    for (i; i<videoLength; i++){
      var el = '<li class="video-item" data-id="'+ i + '">' +
                  '<img src="' + videos[i]["img"] + '" />' +
                  '<span class="video-info">' + videos[i]["name"] + '</span>' +
               '</li>';
      code += el;
    }

    document.getElementById("vlist").innerHTML = code;

    $('body').on('click', '.video-item', function(){

      var p = document.getElementById('player'),
        controls = document.getElementById('controls'),
        $obj = videos[$(this).data('id')];

      if ($obj["type"] !== "flash"){
        p.innerHTML = '<video id="elem" width="560" height="315" autoplay="true" />';
        $(p).append(controls.innerHTML);
        var src = $obj["src"], srcLen = src.length, code = '', i = 0;

        for (i; i<srcLen; i++){
          var v = '<source src="' + src[i] + '" />';
          code += v;
        }

        document.getElementById('elem').innerHTML = code;
        videoPlayer("elem");
      } else {
        p.innerHTML = '<iframe src="' + $obj["src"] + '" width="560" height="315" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen autoplay></iframe>';
      }

    });

  });

})(jQuery);
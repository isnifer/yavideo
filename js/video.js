/*
*   Описание переменных (в скобках элементы по умолчанию)
*
*   el - Видео элемент (video#elem)
*   cont - Блок контролов видео (nav.control-bar)
*   playBtn - Кнопка Play/Pause (i#play-pause)
*   progrElem - Блок прогрессбара-фон (div#progress)
*   barElem - Прогресс-бар (div#bar)
*   nowElem - текущее время (span#time-now)
*   durElem - общее время (span#time-all)
*   muteElem - в перспективе отключение звука, пока что остановка видео (i#volume-speaker)
*   volLvlElem - уровень громкости справа от динамика (i#volume-level)
*   volDragElem - ползунок громкости аудио (input#volume-drag)
*   fullScrBtn - кнопка переключения в полноэкранный режим (i#full-screen)
*   stopElem - кнопка остановки видео (i#stop)
*
* */

function videoPlayer(video){
  // Инициализация элементов видео
  var v = {
    el: document.getElementById('myVideo') || document.getElementById(video.el) || document.getElementById(video),
    cont: document.getElementsByClassName('control-bar') || document.getElementsByClassName(video.cont),
    playBtn: document.getElementById('play-pause') || document.getElementById(video.playBtn),
    progrElem: document.getElementById('progress') || document.getElementById(video.progrElem),
    barElem: document.getElementById('bar') || document.getElementById(video.barElem),
    nowElem: document.getElementById('time-now') || document.getElementById(video.nowElem),
    durElem: document.getElementById('time-all') || document.getElementById(video.durElem),
    muteElem: document.getElementById('volume-speaker') || document.getElementById(video.muteElem),
    volLvlElem: document.getElementById('volume-level') || document.getElementById(video.volLvlElem),
    volDragElem: document.getElementById('volume-drag') || document.getElementById(video.volDragElem),
    fullScrBtn: document.getElementById('full-screen') || document.getElementById(video.fullScrBtn),
    stopBtn: document.getElementById('stop') || document.getElementById(video.stopBtn),
    updateTimer: ''
  };

  // Функционал Play/Pause
  function playPause(){
    if (v.el.paused){
      v.el.play();
      v.playBtn.style.backgroundPosition = '0 0';
      v.playBtn.setAttribute('title', 'Pause');
    } else {
      v.el.pause();
      v.playBtn.style.backgroundPosition = '0 -17px';
      v.playBtn.setAttribute('title', 'Play');
      clearInterval(v.updateTimer);
    }
  }

  /* HTML5 MEDIA ELEMENT API EVENTS */

  // Загружаются данные о видео
  v.el.addEventListener('loadedmetadata', function(){

    // Устанавливаем ширину для контролов в завивисимости от ширины видео
    v.cont[0].style.width = v.el.offsetWidth + 'px';

    // Устанавливаем ширину для прогрессбара в завивисимости от ширины видео
    v.progrElem.style.width = v.el.offsetWidth - 170 + 'px';

    var d = Math.floor(this.duration), h, m,
        s = ((d % 60) < 10) ? '0' + d % 60 : d % 60;

    if (d < 60) {
      m = '00';
      v.durElem.innerHTML = m + ':' + s;
    } else if (d < 360) {
      m = '0' + Math.floor(d / 60);
      v.durElem.innerHTML = m + ':' + s;
    } else if (d < 3600){
      m = Math.floor(d / 60);
      v.durElem.innerHTML = m + ':' + s;
    } else if (d >= 3600){
      h = '0' + Math.floor(d / 3600);
      m = Math.floor((d - h*3600) / 60);
      v.progrElem.style.width = '520px';
      v.durElem.innerHTML = h + ':' + m + ':' + s;
      v.nowElem.innerHTML = '00:00:00';
    }

  }, false);

  // Видео проигрывается
  v.el.addEventListener('play', function(){
    var that = this, d = that.duration;
    v.playBtn.style.backgroundPosition = '0 0';
    v.updateTimer = setInterval(function(){
      // Define variables
      var cTime = Math.floor(that.currentTime),
        timer = {
          "s" : ((cTime % 60) < 10) ? '0' + cTime % 60 : cTime % 60,
          "m" : function(){
            if (cTime < 60){
              return '00';
            } else if (cTime / 60 < 10){
              return '0' + Math.floor(cTime / 60);
            } else {
              return Math.floor(cTime / 60);
            }
          },
          "h" : function(){
            if (cTime >= 3600){
              return '0' + Math.floor(cTime / 3600);
            } else {
              return '00';
            }
          }
        };

      // Format view for Time
      var viewTimer = function(){
        if (d >= 3600){
          return timer.h() + ':' + timer.m() + ':' + timer.s;
        } else {
          return timer.m() + ':' + timer.s;
        }
      };

      // Insert data to DOM
      document.getElementById('time-now').innerText = viewTimer();

      // Update Progress Bar
      v.barElem.style.width = Math.floor((v.progrElem.offsetWidth - 1) * v.el.currentTime / d) + 'px';

    }, 1000)
  }, false);

  // Просмотр видео закончен
  v.el.addEventListener('ended', function(){
    clearInterval(v.updateTimer);
    v.playBtn.style.backgroundPosition = '0 -17px';
    if (v.duration > 3600){
      v.nowElem.innerHTML = '00:00:00';
    } else {
      v.nowElem.innerHTML = '00:00';
    }
  }, false);

  // Изменение громкости
  /*v.volDragElem.addEventListener('change', function(){
    v.el.volume = this.value;
    if (this.value < 0.3){
      v.volLvlElem.style.backgroundPosition = '0 -22px'
    } else if (this.value < 0.7){
      v.volLvlElem.style.backgroundPosition = '0 -11px'
    } else {
      v.volLvlElem.style.backgroundPosition = '0 0'
    }
  }, false);*/


  /* MOUSE EVENTS */

  // Клик по видео
  v.el.addEventListener('click', playPause, false);

  // Клик по кнопке play/pause
  v.playBtn.addEventListener('click', playPause, false);

  // Обработка клика по прогрессбару
  v.progrElem.addEventListener('click', function(e){
    v.el.currentTime = (e.offsetX * Math.floor(v.el.duration)) / (v.progrElem.offsetWidth - 1);
    v.barElem.style.width = e.offsetX + 'px';
  }, false);

  // Стоп
  v.stopBtn.addEventListener('click', function(){
    v.el.pause();
    v.barElem.style.width = 0;
    v.el.currentTime = 0;
    v.playBtn.style.backgroundPosition = '0 -17px';
  }, false);

  // Переключение в полноэкранный режим
  v.fullScrBtn.addEventListener('click', function(){
    var el = v.el;
    if(el.requestFullScreen) {
      el.requestFullScreen();
    } else if(el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if(el.webkitRequestFullScreen) {
      el.webkitRequestFullScreen();
    }
  }, false);

}
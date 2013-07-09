(function(){

/*
*   Описание переменных (в скобках элементы по умолчанию)
*
*   el - Видео элемент (video.elem)
*   cont - Блок контролов видео (nav.control-bar)
*   playBtn - Кнопка Play/Pause (i.play-pause)
*   progrElem - Блок прогрессбара-фон (div.progress)
*   barElem - Прогресс-бар (div.bar)
*   nowElem - текущее время (span.time-now)
*   durElem - общее время (span.time-all)
*   muteElem - в перспективе отключение звука, пока что остановка видео (i.volume-speaker)
*   volLvlElem - уровень громкости справа от динамика (i.volume-level)
*   volDragElem - ползунок громкости аудио (input.volume-drag)
*   fullScrBtn - кнопка переключения в полноэкранный режим (i.full-screen)
*   stopElem - кнопка остановки видео (i.stop)
*
* */

    var VideoPlayer = function (video) {

        'use strict';

        // Сохраним this в переменную
        var obj = this,
        // Инициализация элементов видео
            v = {
                el: (function(){

                    if (typeof video === 'object'){
                        var el = video;
                    } else {
                        el = document.querySelector(video).children[0];
                    }
                    return el;

                })(),
                updateTimer: ''
            },
            controlBar = v.el.nextElementSibling || document.querySelector(video.cont),
            buttons = {
                playBtn: controlBar.children[0] || document.querySelector(video.playBtn),
                progrElem: controlBar.children[2] || document.querySelector(video.progrElem),
                barElem: controlBar.children[2].children[0] || document.querySelector(video.barElem),
                nowElem: controlBar.children[3] || document.querySelector(video.nowElem),
                durElem: controlBar.children[5] || document.querySelector(video.durElem),
                //muteElem: document.querySelector('.volume-speaker') || document.querySelector(video.muteElem),
                //volLvlElem: document.querySelector('.volume-level') || document.querySelector(video.volLvlElem),
                //volDragElem: document.querySelector('.volume-drag') || document.querySelector(video.volDragElem),
                fullScrBtn: controlBar.children[6] || document.querySelector(video.fullScrBtn),
                stopBtn: controlBar.children[1] || document.querySelector(video.stopBtn)
            };


        // Функционал Play/Pause
        this.playPause = function () {

            if (v.el.paused) {
                v.el.play();
                buttons.playBtn.style.backgroundPosition = '0 0';
                buttons.playBtn.setAttribute('title', 'Pause');
            } else {
                v.el.pause();
                buttons.playBtn.style.backgroundPosition = '0 -17px';
                buttons.playBtn.setAttribute('title', 'Play');
                clearInterval(v.updateTimer);
            }
            return false;

        };

        // Вставка информации о видео при загрузке
        this.init = function () {

            // Устанавливаем ширину для контролов в завивисимости от ширины видео
            controlBar.style.width = v.el.offsetWidth + 'px';

            // Устанавливаем ширину для прогрессбара в завивисимости от ширины видео
            buttons.progrElem.style.width = v.el.offsetWidth - 170 + 'px';

            var d = Math.floor(this.duration), h, m,
                s = ((d % 60) < 10) ? '0' + d % 60 : d % 60;

            if (d < 60) {
                m = '00';
                buttons.durElem.innerHTML = m + ':' + s;
            } else if (d < 360) {
                m = '0' + Math.floor(d / 60);
                buttons.durElem.innerHTML = m + ':' + s;
            } else if (d < 3600){
                m = Math.floor(d / 60);
                buttons.durElem.innerHTML = m + ':' + s;
            } else if (d >= 3600){
                h = '0' + Math.floor(d / 3600);
                m = Math.floor((d - h*3600) / 60);
                buttons.progrElem.style.width = '520px';
                buttons.durElem.innerHTML = h + ':' + m + ':' + s;
                buttons.nowElem.innerHTML = '00:00:00';
            }
            return false;

        };

        // Format view for Time
        this._formatTimer = function (timer, d) {

            if (d >= 3600) {
                var formatTime = timer.h() + ':' + timer.m() + ':' + timer.s;
            } else {
                formatTime = timer.m() + ':' + timer.s;
            }
            return formatTime;

        };

        this._updateTimer = function(that, d){
            setInterval(function () {
                // Define variables
                var cTime = Math.floor(that.currentTime),
                    timer = {
                        "s" : ((cTime % 60) < 10) ? '0' + cTime % 60 : cTime % 60,
                        "m" : function () {

                            if (cTime < 60) {
                                var minutes = '00';
                            } else if (cTime / 60 < 10) {
                                minutes = '0' + Math.floor(cTime / 60);
                            } else {
                                minutes = Math.floor(cTime / 60);
                            }
                            return minutes;

                        },
                        "h" : function() {

                            if (cTime >= 3600) {
                                var hours = '0' + Math.floor(cTime / 3600);
                            } else {
                                hours = '00';
                            }
                            return hours;

                        }
                    };

                // Insert data to DOM
                buttons.nowElem.innerHTML = obj._formatTimer(timer, d);

                // Update Progress Bar
                buttons.barElem.style.width = Math.floor((buttons.progrElem.offsetWidth - 1) * v.el.currentTime / d) + 'px';

            }, 1000);
        };

        // Обновление данных в течение проигрывания видео
        this.onPlay = function () {

            var that = this, d = that.duration;
            buttons.playBtn.style.backgroundPosition = '0 0';
            obj._updateTimer(that, d);
            return false;

        };

        // При остановке видео
        this.onStop = function () {

            v.el.pause();
            // Сбросить таймер
            clearInterval(v.updateTimer);
            // Текущее время на 0
            v.el.currentTime = 0;

            // DOM
            buttons.playBtn.style.backgroundPosition = '0 -17px';
            buttons.barElem.style.width = 0;

            if (v.duration > 3600){
                buttons.nowElem.innerHTML = '00:00:00';
            } else {
                buttons.nowElem.innerHTML = '00:00';
            }
            return false;

        };

        // Для перехода в полноэкранный режим
        this.toFullScreen = function () {

            var el = v.el;
            if(el.requestFullScreen) {
                el.requestFullScreen();
            } else if(el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if(el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen();
            }
            return false;

        };

        this.onProgressClick = function (e) {

            var eventX = e.offsetX || e.layerX;  // Firefox fix
            buttons.barElem.style.width = eventX + 'px';
            v.el.currentTime = Math.floor((eventX * Math.floor(v.el.duration)) / (buttons.progrElem.offsetWidth - 1));
            return false;

        };

        /* MEDIA ELEMENT EVENTS */

        // Загружаются данные о видео
        v.el.addEventListener('loadedmetadata', this.init, false);

        // Видео проигрывается
        v.el.addEventListener('play', this.onPlay, false);

        // Просмотр видео закончен
        v.el.addEventListener('ended', this.onStop, false);

        /* MOUSE EVENTS */

        // Клик по видео
        v.el.addEventListener('click', this.playPause, false);

        // Клик по кнопке "Play/Pause"
        buttons.playBtn.addEventListener('click', this.playPause, false);

        // Клик по "Прогрессбару"
        buttons.progrElem.addEventListener('click', this.onProgressClick, false);

        // Клик по кнопке "Стоп"
        buttons.stopBtn.addEventListener('click', this.onStop, false);

        // Клик по кнопке "Полноэкранный режим"
        buttons.fullScrBtn.addEventListener('click', this.toFullScreen, false);

        /* Изменение громкости
        this.volumeChange = function(){
            v.el.volume = this.value;
            if (this.value < 0.3){
                v.volLvlElem.style.backgroundPosition = '0 -22px'
            } else if (this.value < 0.7){
                v.volLvlElem.style.backgroundPosition = '0 -11px'
            } else {
                v.volLvlElem.style.backgroundPosition = '0 0'
            }
        };
        v.volDragElem.addEventListener('change', this.volumeChange, false);
        */

    };

    // Get All Videos from page...
    var videos = document.getElementsByTagName('video'),
        videosLen = videos.length,
        i = 0,
        arr = [];

    // ...and apply Video Player
    for (i; i<videosLen; i++) {
        arr[i] = new VideoPlayer(videos[i]);
    }

})();
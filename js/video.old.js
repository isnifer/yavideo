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

    function VideoPlayer(video, videoId) {

        // Сохраним this в переменную
        var obj = this,
            controls = [
                {
                    name: 'controlBar',
                    parent: '',
                    tag: 'nav',
                    className: 'control-bar',
                    html: ''
                },
                {
                    name: 'playBtn',
                    parent: '.control-bar',
                    tag: 'i',
                    className: 'play-pause',
                    html: 'Play'
                },
                {
                    name: 'stopBtn',
                    parent: '.control-bar',
                    tag: 'i',
                    className: 'stop',
                    html: 'Stop'
                },
                {
                    name: 'progrElem',
                    parent: '.control-bar',
                    tag: 'div',
                    className: 'progress',
                    html: ''
                },
                {
                    name: 'barElem',
                    parent: '.progress',
                    tag: 'div',
                    className: 'bar',
                    html: ''
                },
                {
                    name: 'nowElem',
                    parent: '.control-bar',
                    tag: 'span',
                    className: 'time-now',
                    html: '00:00'
                },
                {
                    name: 'minus',
                    parent: '.control-bar',
                    tag: 'span',
                    className: 'minus',
                    html: '&nbsp;-&nbsp;'
                },
                {
                    name: 'durElem',
                    parent: '.control-bar',
                    tag: 'span',
                    className: 'time-all',
                    html: '00:00'
                },
                {
                    name: 'fullScrBtn',
                    parent: '.control-bar',
                    tag: 'i',
                    className: 'full-screen',
                    html: ''
                }
            ];

        this.world = 'Hello World';

        // Инициализация элементов видео
        this.v = {
            el: (function () {

                if (typeof video === 'object') {
                    var el = video;
                } else {
                    el = document.querySelector(video).children[0];
                }
                return el;

            }()),
            updateTimer: ''
        };


        this.buttons = {};

        // Core Methods
        this.Controller = {};

        // DOM Methods
        this.View = {};

        this.initControls = function (controls) {

            var controlsLen = controls.length, i = 0, bar, el;

            for (i; i < controlsLen; i++){

                if (controls[i].tag === 'nav') {
                    bar = document.createElement(controls[i].tag);
                    bar.className = controls[i].className + ' video-' + videoId;
                    obj.buttons.controlBar = bar;
                    this.v.el.parentNode.appendChild(obj.buttons.controlBar);
                } else {
                    el = document.createElement(controls[i].tag);
                    el.className = controls[i].className + ' video-' + videoId;
                    el.innerHTML = controls[i].html;
                    obj.buttons[controls[i].name] = el;
                    document.querySelector(controls[i].parent + '.video-' + videoId).appendChild(el);
                }

            }
            return obj.buttons;

        };

        this.initControls(controls);

        // Вставка информации о видео при загрузке
        this.init = function () {

            // Устанавливаем ширину для контролов в завивисимости от ширины видео
            obj.buttons.controlBar.style.width = obj.v.el.offsetWidth + 'px';

            // Устанавливаем ширину для прогрессбара в завивисимости от ширины видео
            obj.buttons.progrElem.style.width = obj.v.el.offsetWidth - 170 + 'px';

            var d = Math.floor(this.duration), h, m,
                s = ((d % 60) < 10) ? '0' + d % 60 : d % 60;

            if (d < 60) {
                m = '00';
                obj.buttons.durElem.innerHTML = m + ':' + s;
            } else if (d < 360) {
                m = '0' + Math.floor(d / 60);
                obj.buttons.durElem.innerHTML = m + ':' + s;
            } else if (d < 3600) {
                m = Math.floor(d / 60);
                obj.buttons.durElem.innerHTML = m + ':' + s;
            } else if (d >= 3600) {
                h = '0' + Math.floor(d / 3600);
                m = Math.floor((d - h * 3600) / 60);
                obj.buttons.progrElem.style.width = '520px';
                obj.buttons.durElem.innerHTML = h + ':' + m + ':' + s;
                obj.buttons.nowElem.innerHTML = '00:00:00';
            }

            return false;

        };

        // Форматированный вывод времени
        this._formatTimer = function (timer, d) {

            if (d >= 3600) {
                var formatTime = timer.h() + ':' + timer.m() + ':' + timer.s;
            } else {
                formatTime = timer.m() + ':' + timer.s;
            }
            return formatTime;

        };

        // Обновление таймера видео
        this._updateTimer = function (that, d) {
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
                        "h" : function () {

                            if (cTime >= 3600) {
                                var hours = '0' + Math.floor(cTime / 3600);
                            } else {
                                hours = '00';
                            }
                            return hours;

                        }
                    };

                // Insert data to DOM
                obj.buttons.nowElem.innerHTML = obj._formatTimer(timer, d);

                // Update Progress Bar
                obj.buttons.barElem.style.width = Math.floor((obj.buttons.progrElem.offsetWidth - 1) * obj.v.el.currentTime / d) + 'px';

            }, 1000);
        };

        // Обновление данных в течение проигрывания видео
        this.onPlay = function () {

            var that = this,        // Video Element
                d = that.duration;

            obj.buttons.playBtn.style.backgroundPosition = '0 0';

            // Функция обновления таймера
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
            obj.buttons.playBtn.style.backgroundPosition = '0 -17px';
            obj.buttons.barElem.style.width = 0;

            if (v.duration > 3600) {
                obj.buttons.nowElem.innerHTML = '00:00:00';
            } else {
                obj.buttons.nowElem.innerHTML = '00:00';
            }
            return false;

        };

        // Для перехода в полноэкранный режим
        this.toFullScreen = function () {

            var el = v.el;
            if (el.requestFullScreen) {
                el.requestFullScreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullScreen) {
                el.webkitRequestFullScreen();
            }
            return false;

        };

        this.onProgressClick = function (e) {

            var eventX = e.offsetX || e.layerX;  // Firefox fix
            obj.buttons.barElem.style.width = eventX + 'px';
            v.el.currentTime = Math.floor((eventX * Math.floor(v.el.duration)) / (obj.buttons.progrElem.offsetWidth - 1));
            return false;

        };

        /* MEDIA ELEMENT EVENTS */

        // Загружаются данные о видео
        this.v.el.addEventListener('loadedmetadata', this.init, false);

        // Видео проигрывается
        this.v.el.addEventListener('play', this.onPlay, false);

        // Просмотр видео закончен
        this.v.el.addEventListener('ended', this.onStop, false);

        /* MOUSE EVENTS */

        // Клик по видео
        this.v.el.addEventListener('click', this.playPause, false);

        // Клик по кнопке "Play/Pause"
        this.buttons.playBtn.addEventListener('click', this.playPause, false);

        // Клик по "Прогрессбару"
        this.buttons.progrElem.addEventListener('click', this.onProgressClick, false);

        // Клик по кнопке "Стоп"
        this.buttons.stopBtn.addEventListener('click', this.onStop, false);

        // Клик по кнопке "Полноэкранный режим"
        this.buttons.fullScrBtn.addEventListener('click', this.toFullScreen, false);

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

    }

    // Функционал Play/Pause

    VideoPlayer.prototype = {

        playPause : function (that) {

            if (that.v.el.paused) {
                that.v.el.play();
                that.buttons.playBtn.style.backgroundPosition = '0 0';
                that.buttons.playBtn.setAttribute('title', 'Pause');
            } else {
                that.v.el.pause();
                that.buttons.playBtn.style.backgroundPosition = '0 -17px';
                that.buttons.playBtn.setAttribute('title', 'Play');
                clearInterval(this.v.updateTimer);
            }
            return false;

        },

        getItems : function () {
            return this.world;
        }

    };

    // Get All Videos from page...
    var videos = document.getElementsByTagName('video'),
        videosLen = videos.length,
        i = 0,
        arr = [];

    // ...and apply Video Player
    for (i; i < videosLen; i++) {
        arr[i] = new VideoPlayer(videos[i] , i);
    }

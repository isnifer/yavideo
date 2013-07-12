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

function VideoModel (video, videoId) {

    this.counter = videoId;

    // Сохраним this в переменную
    this.controls = [
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

    //
    this.buttons = {};

}

VideoModel.prototype = {

    initControls : function (controls) {

        var controlsLen = controls.length, i = 0, bar, el;

        // Создаем и подключаем контролы управления видео в DOM
        for (i; i < controlsLen; i++){

            if (controls[i].tag === 'nav') {
                bar = document.createElement(controls[i].tag);
                bar.className = controls[i].className + ' video-' + this.counter;
                this.buttons.controlBar = bar;
                this.v.el.parentNode.appendChild(this.buttons.controlBar);
            } else {
                el = document.createElement(controls[i].tag);
                el.className = controls[i].className + ' video-' + this.counter;
                el.innerHTML = controls[i].html;
                this.buttons[controls[i].name] = el;
                document.querySelector(controls[i].parent + '.video-' + this.counter).appendChild(el);
            }

        }

        return this.buttons;

    },

    // Вставка информации о видео при загрузке
    init : function () {

        // Устанавливаем ширину для контролов в завивисимости от ширины видео
        this.buttons.controlBar.style.width = this.v.el.offsetWidth + 'px';

        // Устанавливаем ширину для прогрессбара в завивисимости от ширины видео
        this.buttons.progrElem.style.width = this.v.el.offsetWidth - 170 + 'px';

        var d = Math.floor(this.v.el.duration), h, m,
            s = ((d % 60) < 10) ? '0' + d % 60 : d % 60;

        // В зависимости от продолжительности выставляем необходимое кол-во 00 в текущее время
        if (d < 60) {
            m = '00';
            this.buttons.durElem.innerHTML = m + ':' + s;
        } else if (d < 360) {
            m = '0' + Math.floor(d / 60);
            this.buttons.durElem.innerHTML = m + ':' + s;
        } else if (d < 3600) {
            m = Math.floor(d / 60);
            this.buttons.durElem.innerHTML = m + ':' + s;
        } else if (d >= 3600) {
            h = '0' + Math.floor(d / 3600);
            m = Math.floor((d - h * 3600) / 60);
            this.buttons.progrElem.style.width = '520px';
            this.buttons.durElem.innerHTML = h + ':' + m + ':' + s;
            this.buttons.nowElem.innerHTML = '00:00:00';
        }

        return false;

    }

};

function VideoView (model) {

    this._model = model;

    this.el = this._model.v.el;
    this.timer = this._model.v.updateTimer;

    this.buttons = this._model.initControls(this._model.controls);

}

VideoView.prototype = {

    // Функционал Play/Pause
    playPause : function () {

        // Если видео на паузе или остановлено запускаем
        if (this.el.paused) {
            this.el.play();

            // Play icon -> Pause icon
            this.buttons.playBtn.style.backgroundPosition = '0 0';
            this.buttons.playBtn.setAttribute('title', 'Pause');
        } else {
            // Если проигрывается - останавливаем
            this.el.pause();

            // Pause icon -> Play icon
            this.buttons.playBtn.style.backgroundPosition = '0 -17px';
            this.buttons.playBtn.setAttribute('title', 'Play');

            // Останавливаем таймер
            clearInterval(this.timer);
        }
        return false;

    },

    // Форматированный вывод времени
    formatTimer : function (timer, d) {

        // В зависимости от продолжительности выводим форматированную дату
        if (d >= 3600) {
            var formatTime = timer.h() + ':' + timer.m() + ':' + timer.s;
        } else {
            formatTime = timer.m() + ':' + timer.s;
        }
        return formatTime;

    },

    // Обновление таймера видео
    updateTimer : function (that, duration) {
        setInterval(function () {
            // Определяем часы секунды, минуты, часы
            var cTime = Math.floor(that.el.currentTime),
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

            // Вставляем текущее время в DOM
            that.buttons.nowElem.innerHTML = that.formatTimer(timer, duration);

            // Обновляем ProgressBar
            that.buttons.barElem.style.width = Math.floor((that.buttons.progrElem.offsetWidth - 1) * that.el.currentTime / duration) + 'px';

        }, 1000);
    },

    // Обновление данных в течение проигрывания видео
    onPlay : function () {

        // Получаем продолжительность видео
        var duration = this.el.duration;
        // Функция обновления таймера
        this.updateTimer(this, duration);

        // Play icon -> Pause icon
        this.buttons.playBtn.style.backgroundPosition = '0 0';

        return false;

    },

    // При остановке видео
    onStop : function () {

        this.el.pause();
        // Сбросить таймер
        clearInterval(this.timer);
        // Текущее время на 0
        this.el.currentTime = 0;

        // Pause icon -> Play icon, ProgressBar width = 0
        this.buttons.playBtn.style.backgroundPosition = '0 -17px';
        this.buttons.barElem.style.width = 0;

        // У текущего времени выставить нулевые значения
        if (this.el.duration > 3600) {
            this.buttons.nowElem.innerHTML = '00:00:00';
        } else {
            this.buttons.nowElem.innerHTML = '00:00';
        }
        return false;

    },

    // Для перехода в полноэкранный режим
    toFullScreen : function () {

        var el = this.el;
        if (el.requestFullScreen) {
            el.requestFullScreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
            el.webkitRequestFullScreen();
        }
        return false;

    },

    onProgressClick : function (e) {

        var eventX = e.offsetX || e.layerX;  // Firefox fix
        this.buttons.barElem.style.width = eventX + 'px';
        this.el.currentTime = Math.floor((eventX * Math.floor(this.el.duration)) / (this.buttons.progrElem.offsetWidth - 1));
        return false;

    }

};


function VideoController (model, view) {

    var that = this;

    this._model = model;
    this._view = view;
    this.buttons = this._view.buttons;
    this._el = this._model.v.el;

    /* MEDIA ELEMENT EVENTS */

    // Загружаются данные о видео
    this._el.addEventListener('loadedmetadata', function () {
        that._model.init();
    }, false);

    // Видео проигрывается
    this._el.addEventListener('play', function () {
        that._view.onPlay();
    }, false);

    // Просмотр видео закончен
    this._el.addEventListener('ended', function () {
        that._view.onStop();
    }, false);


    /* MOUSE EVENTS */

    // Клик по видео
    this._el.addEventListener('click', function () {
        that._view.playPause();
    }, false);

    // Клик по кнопке "Play/Pause"
    this.buttons.playBtn.addEventListener('click', function () {
        that._view.playPause();
    }, false);

    // Клик по "Прогрессбару"
    this.buttons.progrElem.addEventListener('click', function () {
        that._view.onProgressClick();
    }, false);

    // Клик по кнопке "Стоп"
    this.buttons.stopBtn.addEventListener('click', function () {
        that._view.onStop();
    }, false);

    // Клик по кнопке "Полноэкранный режим"
    this.buttons.fullScrBtn.addEventListener('click', function () {
        that._view.toFullScreen();
    }, false);

}


(function () {

    // Get All Videos from page...
    var videos = document.getElementsByTagName('video'),
        videosLen = videos.length,
        i = 0,
        models = [],
        views = [],
        controllers = [];

    // ...and apply Video Player
    for (i; i < videosLen; i++) {
        models[i] = new VideoModel(videos[i] , i);
        views[i] = new VideoView(models[i]);
        controllers[i] = new VideoController(models[i], views[i]);
    }

}());

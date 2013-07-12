(function(){

        // Показывает текст, если по какой-то причине нет иконок браузеров
    var viewHiddenText = function(){
        var arr = document.getElementsByClassName('hide'),
            arrLength = arr.length,
            i = 0;

            for (i; i < arrLength; i++) {
                arr[i].style.display = 'inline';
            }

    },
        xhr,
        progressBar,
        testImg = document.getElementsByClassName('test')[0],
        logo = document.getElementsByClassName('logo')[0],
        // Получаем url изображения иконок браузеров
        getBackgroundImage = function (elem) {

            var style = window.getComputedStyle(elem),
                backgroundImage = style.backgroundImage;

            backgroundImage = backgroundImage.substring(backgroundImage.search('img'), backgroundImage.indexOf('png'));
            backgroundImage = backgroundImage + 'png';

            return backgroundImage;

        };

    // Проверяем в наличии ли картинка на странице
    if (!testImg.width){
        viewHiddenText();
    }


    // Проверяем доступны ли иконки браузеров
    xhr = new XMLHttpRequest();
    xhr.open('GET', getBackgroundImage(logo), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                viewHiddenText();
            }
        }
    };
    xhr.send(null);

    // Обновляем ProgressBar
    progressBar = setInterval(function(){

        var bar = document.getElementsByClassName('bar')[0],
            progress = document.getElementsByClassName('progress')[0],
            digit = document.getElementById('digit'),
            barWidth = (bar.offsetWidth / progress.offsetWidth * 100),
            percents;

        barWidth += 1;

        percents = Math.floor(barWidth);
        bar.style.width = barWidth + '%';
        digit.innerHTML = percents;

        if (percents > 99){
            clearInterval(progressBar);
        }

    }, 1000);

}());
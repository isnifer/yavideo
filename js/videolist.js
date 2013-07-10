(function () {

    'use strict';

    var videos = [
        {
            "type": "flash",
            "img": "img/preview/1.jpg",
            "name": "Slim - Девочка",
            "src": "http://vk.com/video_ext.php?oid=-52076382&id=165430119&hash=f32da051480909af&autoplay=1"
        },
        {
            "type": "flash",
            "img": "img/preview/2.jpg",
            "name": "Myway - Dance centre",
            "src": "http://vk.com/video_ext.php?oid=66904554&id=163462121&hash=d54d771c0c81591c&autoplay=1?iphone"
        },
        {
            "type": "flash",
            "img": "img/preview/3.jpg",
            "name": "Linkin Park - Castle of Glass",
            "src": "http://www.youtube.com/embed/ScNNfyq3d_w?autoplay=1"
        },
        {
            "type": "flash",
            "img": "img/preview/4.jpg",
            "name": "Linkin Park - Numb",
            "src": "http://www.youtube.com/embed/kXYiU_JCYtU?autoplay=1"
        },
        {
            "type": "flash",
            "img": "img/preview/5.jpg",
            "name": "Санкт-Петербург",
            "src": "http://player.vimeo.com/video/46358463?autoplay=1"
        },
        {
            "type": "flash",
            "img": "img/preview/6.jpg",
            "name": "Linkin Park - New Divide",
            "src": "http://vk.com/video_ext.php?oid=142385829&id=164602717&hash=e7a5c134af871eec&autoplay=1?iphone"
        },
        {
            "type": "flash",
            "img": "img/preview/7.jpg",
            "name": "Linkin Park - Not Alone",
            "src": "http://player.vimeo.com/video/9564507?autoplay=1"
        },
        {
            "type": "html5",
            "img": "img/preview/8.jpg",
            "name": "W3C player demonstration video",
            "src": [
                "video/trailers/trailers.webm",
                "video/trailers/trailers.mp4",
                "video/trailers/trailers.wmv",
                "video/trailers/trailers.ogv"
            ]
        },
        {
            "type": "html9",
            "img": "img/preview/9.jpg",
            "name": "HTML5 Tutorial from Nettuts",
            "src": [
                "video/html5/html5.webm",
                "video/html5/html5.mp4",
                "video/html5/html5.wmv",
                "video/html5/html5.ogv"
            ]
        }

    ],
        results = document.querySelector('.results'),
        onVideoClick = function () {

            var p = document.getElementById('player'),
                controls = document.getElementById('controls'),
                $obj = videos[this.getAttribute('data-id')],
                src = $obj.src,
                srcLen = src.length,
                i = 0,
                player,
                iframe = document.createElement('iframe'),
                videoElem = document.createElement('video'),
                source,
                insertVideoHtml5,
                insertVideoHosting;

            insertVideoHtml5 = function () {

                videoElem.id = 'elem';
                videoElem.style.width = 560 + 'px';
                videoElem.style.height = 315 + 'px';
                videoElem.setAttribute('autoplay', true);

                for (i; i<srcLen; i++) {
                    source = document.createElement('source');
                    source.src = src[i];
                    videoElem.appendChild(source);
                }

                p.innerHTML = '';    // Remove Previous Content
                p.appendChild(videoElem);

                player = new VideoPlayer(videoElem);

            };

            insertVideoHosting = function () {

                iframe.src = $obj.src;
                iframe.style.width = 560 + 'px';
                iframe.style.height = 315 + 'px';
                iframe.style.border = 0;
                iframe.setAttribute('webkitAllowFullScreen', true);
                iframe.setAttribute('mozallowfullscreen', true);
                iframe.setAttribute('allowFullScreen', true);
                iframe.setAttribute('autoplay', true);
                p.innerHTML = '';
                p.appendChild(iframe);

            };

            if ($obj.type !== "flash") {
                insertVideoHtml5();
            } else {
                insertVideoHosting();
            }
        };

        // Вставляем превью видео
        (function () {

            var videoLength = videos.length,
                i = 0, // iterator
                j = 0, // iterator
                el,   // video item code
                pic, span, // preview pic and video name
                videoList = document.createElement('ul'),
                videoItems,  // DOM video list
                videoItemLength;

            videoList.className = 'video-list';

            for (i; i < videoLength; i++) {

                el = document.createElement('li');
                pic = document.createElement('img');
                span = document.createElement('span');
                el.className = 'video-item';
                el.setAttribute('data-id', i);
                pic.src = videos[i].img;
                span.className = 'video-info';
                span.innerHTML = videos[i].name;
                el.appendChild(pic);
                el.appendChild(span);
                videoList.appendChild(el);

            }

            results.appendChild(videoList);

            videoItems = document.querySelectorAll('.video-item');
            videoItemLength = videoItems.length;

            for (j; j < videoItemLength; j++) {
                videoItems[j].addEventListener('click', onVideoClick, false);
            }

        }());

}());
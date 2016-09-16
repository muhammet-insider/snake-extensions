/**
 * Created by lenovo on 12/09/2016.
 */
$(document).ready(function () {
    (function () {

        var snakeBody = jQuery('<div class="snakeBody">');

        var SkorBord=jQuery('<div class="skorBord"><h3 class="snakeScore">Skor : 0</h3></br><h4 class="statusBoard">Oyun : Oynanıyor!</h4></br><p>Space:Durdurma</br>Kontrol için Yön tuşları</p></div>');

        var positionList = JSON.parse(localStorage.getItem('positionList') || '[{"top":60,"left":75},{"top":60,"left":60},{"top":60,"left":45},{"top":60,"left":30},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15},{"top":60,"left":15}]');

        var direction = JSON.parse(localStorage.getItem('direction')) || {
                horizontal: 1,
                vertical: 0
            };


        var _status = localStorage.getItem('_status') || false;
        var _dir = null;
        var getNextPosition = function (elem) {
            var elemLeft=jQuery(elem).css('left').replace('px', '');
            var elemTop=jQuery(elem).css('top').replace('px', '');
            if(elemLeft>0&&elemLeft<jQuery(window).width()&&elemTop>0&&elemTop<jQuery(window).height){
                var position = {};
                //***
                direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px', '')) + (direction.horizontal * 15));
                direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px', '')) + (direction.vertical * 15));

                position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
                position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));

                return position;
            }
            else {
                $('.statusBoard').text('Oyun : Bitti!');
                clearGameData();
                _status=true;
                keyDownStatus=false;
            }
        };

        var elemaniGetir = function () {
            var targetArea = {
                top: Number(jQuery('.snakeBody:first').css('top').replace('px', '')) + (direction.vertical && direction.vertical * 15),
                left: Number(jQuery('.snakeBody:first').css('left').replace('px', '')) + (direction.horizontal && direction.horizontal * 15)
            };
            return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
        };

        var saveGameData = function () {
            localStorage.setItem('positionList', JSON.stringify(positionList));
            localStorage.setItem('direction', JSON.stringify(direction));
            localStorage.setItem('_status',_status);
            localStorage.setItem('keyDownStatus',keyDownStatus);
            localStorage.setItem('snakeScore',getScore());
        };

        var clearGameData=function () {
            localStorage.removeItem('positionList');
            localStorage.removeItem('direction');
            localStorage.removeItem('_status');
            localStorage.removeItem('keyDownStatus');
            localStorage.removeItem('snakeScore');

        };

        var _SPACE = 32;
        var _LEFT = 37;
        var _UP = 38;
        var _RIGHT = 39;
        var _DOWN = 40;
        var R = 1;
        var L = -1;
        var U = -1;
        var D = 1;
        var _lastDir = direction;
        var snakeLong=5;
        var snakeScore=Number(localStorage.getItem('snakeScore')||0);
        var mainTop=$(window).height();
        var mainLeft=$(window).width();
        var step=1;
        var stepScore=1;
        var stepFeed=1;
        var keyDownStatus= /*localStorage.getItem('keyDownStatus') ||*/ true;
        jQuery(document).keydown(function (e) {
            if (jQuery.inArray(e.keyCode, [32, 37, 38, 39, 40]) == -1) return;
            if (e.keyCode == _SPACE && keyDownStatus==true) {
                if(_status==false){
                    $('.statusBoard').text('Oyun : Durdu!');
                    _status=true;
                }else{
                    $('.statusBoard').text('Oyun : Oynanıyor!');
                    _status=false;
                }
                //saveGameData();
                //elemaniGetir().length > 0 && (elemaniGetir()[0].click());
                e.preventDefault();
                return;
            }
            if (e.keyCode == _LEFT) {
                if (_lastDir.horizontal != R) {
                    direction={horizontal:L,vertical:0};
                }
            }
            else if (e.keyCode == _RIGHT) {
                if (_lastDir.horizontal != L) {
                    direction={horizontal:R,vertical:0};
                }
            }
            else if (e.keyCode==_UP){
                if(_lastDir.vertical!=D){
                    direction={horizontal:0,vertical:U};
                }
            }
            else if(e.keyCode==_DOWN){
                if(_lastDir.vertical!=U){
                    direction={horizontal:0,vertical:D};
                }
            }
            _lastDir=direction;
            e.preventDefault();
        });

        function getScore() {
            return snakeScore;
        }

        function setScore(newValue) {
            snakeScore=Number(snakeScore+newValue);
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function feedForSnake(){
            jQuery('body').append(snakeBody.clone().addClass('feedForSnake').removeClass('snakeBody').css('left',getRandomInt(60,300)).css('top',getRandomInt(60,300)));
        }

        function elemControl($div1, $div2) {
            var x1 = $div1.offset().left;
            var y1 = $div1.offset().top;
            var h1 = $div1.outerHeight(true);
            var w1 = $div1.outerWidth(true);
            var b1 = y1 + h1;
            var r1 = x1 + w1;
            var x2 = $div2.offset().left;
            var y2 = $div2.offset().top;
            var h2 = $div2.outerHeight(true);
            var w2 = $div2.outerWidth(true);
            var b2 = y2 + h2;
            var r2 = x2 + w2;
            if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
            return true;
        }

        var gameInterval=setInterval(function () {
            if(!_status){
                jQuery('.snakeBody').each(function (key) {
                    positionList[key] = {
                        top: Number(jQuery(this).css('top').replace('px', '')),
                        left: Number(jQuery(this).css('left').replace('px', ''))
                    };
                    //else _status=false;
                    if(positionList.length>=4){
                        step++;
                        if(step>$('.snakeBody').length*8){
                            for(var i=1;i<$('.snakeBody').length;i++){
                                if(positionList[0].left==positionList[i].left&&positionList[0].top==positionList[i].top) {
                                    $('.statusBoard').text('Oyun : Bitti!');
                                    clearGameData();
                                    _status =true;
                                    keyDownStatus=false;
                                    clearInterval(gameInterval);
                                }
                            }
                        }
                    }
                    if (key == 0) {
                        jQuery(this).css(getNextPosition(jQuery(this)));
                    }
                    else
                        jQuery(this).css(positionList[key - 1]);
                });
                if(stepScore==100||stepScore>100){
                    setScore(1);
                    stepScore=1;
                }
                else stepScore++;
                if(($('body').has('.feedForSnake')).length!=0){
                    if(elemControl($('.snakeBody:first'),$('.feedForSnake'))){
                        jQuery('.feedForSnake').css('display','none').remove();
                        jQuery('body').append(snakeBody.clone().css(positionList[snakeBody.size+1] || {}));

                        setScore(2);
                    }
                }else feedTimer();
                if($('.snakeBody').length>14){
                    _status=true;
                    $('.statusBoard').text('Oyun : Bitti!');
                    alert('Oyunu Kazandınız!');
                }
                $('.snakeScore').text('Skor : '+getScore());
            }
        }, 200);

        function feedTimer() {
            if(stepFeed>=50){
                if(($('body').has('.feedForSnake'))){
                    stepFeed=1;
                    feedForSnake();
                }
            }else stepFeed++;
        }

        if (jQuery('body').has(SkorBord).length==0) {
            jQuery('body').append(SkorBord);
        }

        jQuery('body').append('<style>.statusBoard{font-size: 15px;}.skorBord{background-color:#fff;border-radius:5px;font-weight:bold;padding-top:20px;padding-bottom:20px;top:0;text-align:center;width:150px;height:300px;margin-left:-75px;z-index:99999999; border:1px solid red; position:fixed; right: 0; color:#000;}.feedForSnake{ z-index:99999998; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;}.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;} .snakeBody:first-child {background: red;}</style>');

        var i = 0;
        while (i < snakeLong) {
            jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
            i++;
        }
        jQuery('.snakeBody:first').css('background', 'red');
        $('a').on('click',function () {
           saveGameData();
        });
    })();
});
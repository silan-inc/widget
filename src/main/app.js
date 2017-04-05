/**
 * Created by dingyuxuan on 2017/4/5.
 */

import Net from '../components/net';
import Index_ from '../pages/index';
import Login_ from '../pages/login';
import personSetting_ from '../pages/personSetting';

// Initialize app
let myApp = new Framework7({
    swipeBackPage: false,
    pushState: true,
    swipePanel: 'left',
    modalTitle: 'Title'
});
let server = Net();

$$('body').on('click', '.js-add-to-fav', function () {
    myApp.alert('You love this post!', '');
});

let mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('.popup-splash').on('opened', function () {
    let mySwiper = myApp.swiper('.swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationBulletRender: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    });
});

$$(document).on('pageAfterAnimation', function (e) {
    naxvarBg();
});

$$(document).on('pageInit', function (e) {
    let page = e.detail.page;

    myApp.calendar({
        input: '#ks-calendar-default'
    });

    myApp.calendar({
        input: '#calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });

    myApp.calendar({
        input: '#calendar-range',
        dateFormat: 'M dd yyyy',
        rangePicker: true
    });

    var today = new Date();
    var weekLater = new Date().setDate(today.getDate() + 7);

    myApp.calendar({
        input: '#calendar-disabled',
        dateFormat: 'M dd yyyy',
        disabled: {
            from: today,
            to: weekLater
        }
    });

    myApp.calendar({
        container: '#calendar-inline-container',
        value: [new Date()]
    });

    $('.zoom').swipebox();

    $('.navbar').removeClass('navbar-clear');

    if (page.name === 'index'
        || page.name === 'dashboard-1'
        || page.name === 'post'
        || page.name === 'menu'
        || page.name === 'login'
        || page.name === 'registration'
        || page.name === 'article'
        || page.name === 'splash') {
        $('.navbar').addClass('navbar-clear');
    }

    switch (page.name) {
        case 'index':
            Index_();
            break;
        case 'login':
            Login_();
            break;
        case 'personSetting':
            personSetting_();
            break;
    }

    // Conversation flag
    var conversationStarted = false;

// Init Messages
    var myMessages = myApp.messages('.messages', {
        autoLayout: true
    });

// Init Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

// Handle message
    $$('.messagebar .link').on('click', function () {
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (messageText.length === 0) return;

        // Empty messagebar
        myMessagebar.clear()

        // Random message type
        var messageType = (['sent', 'received'])[Math.round(Math.random())];

        // Avatar and name for received message
        var avatar, name;
        if (messageType === 'received') {
            avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
            name = 'Kate';
        }
        // Add message
        myMessages.addMessage({
            // Message text
            text: messageText,
            // Random message type
            type: messageType,
            // Avatar and name:
            avatar: avatar,
            name: name,
            // Day
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });

        // Update conversation flag
        conversationStarted = true;
    });

});

$(document).ready(function () {
    if (localStorage.getItem('newOptions') === null || localStorage.getItem('newOptions') === true) {
        myApp.popup('.popup-splash');
        localStorage.setItem('newOptions', true);
    }

    updateUserInfo();

    naxvarBg();

    $('.js-toggle-menu').on('click', function () {
        $(this).next().slideToggle(200);
        $(this).find('span').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
    });

    $('body').on('click', '.js-gallery-col', function () {
        var cols = $(this).data('cols');
        $('.gallery-list').attr({'data-cols': cols});

        $('.js-gallery-col').removeClass('active');
        $(this).addClass('active');
    });
});


$.fn.serializeObject = () => {
    let o = {};
    let a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

window.findElement = (selector) => {
    let box = null;

    if ($('.page-on-center').length > 0) {
        box = $('.view-main').find('.page-on-center ' + selector);

        if (box.length === 0) {
            box = $('.view-main').find('.page-on-center' + selector);
        }

    } else {
        box = $('.view-main').find('.page').find(selector);
    }

    return box;
};

function naxvarBg() {
    let navbar = $('.navbar-anim-on-scroll'),
        box = null,
        cls = 'active';

    if (navbar.length === 0) {
        return false;
    }

    if ($('.page-on-center').length > 0) {
        box = navbar.next().find('.page-on-center .page-content');
    } else {
        box = navbar.next().find('.page .page-content');
    }

    if (box.scrollTop() > 10) {
        navbar.addClass(cls);
    } else {
        navbar.removeClass(cls);
    }

    box.scroll(function () {
        if ($(this).scrollTop() > 40) {
            navbar.addClass(cls);
        } else {
            navbar.removeClass(cls);
        }
    });
}

function updateUserInfo() {
    let personBox = $('.logo-box');
    if (localStorage.getItem('userInfo') !== null && JSON.parse(localStorage.getItem('userInfo')) !== undefined) {
        $$('.withoutLogin').hide();

        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        $('#userName').text(userInfo['true_name']);
        $('#enableValue').text('储值: ' + userInfo['enable_value']);
        $('#enablePoint').text('积分: ' + userInfo['enable_point']);

        if (userInfo['head_img'] !== '') {
            $('#userImg').attr('src', userInfo['head_img']);
        }

        personBox.off('click');
        personBox.on('click', function () {
            mainView.router.loadPage('personSetting.html');
            myApp.closePanel();
        });
    } else {
        personBox.off('click');
        personBox.on('click', function () {
            console.log("don't touch me!");
        });

        $('#userName').text('积米花会员');
        $('#enableValue').text('请登陆');
        $('#enablePoint').text('');
        $('#userImg').attr('src', 'assets/img/tmp/ava-demo.jpg');
    }
}

window.Logoff = () => {
    localStorage.removeItem('userInfo');
    updateUserInfo();
    mainView.router.loadPage('index2.html');
};

window.hidePreloader = () => {
    jQuery('.page-preloader').animate({
        opacity: 0
    }, function () {
        jQuery(this).hide();
    });
};

window.goWePay = () => {

    myApp.showPreloader('即将支付。。。');
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var sess = userInfo['session'];
    var fd = new FormData();
    fd.append('store_id', 1);
    fd.append('cash_total', 1);
    fd.append('value_total', 0);
    fd.append('pay_type', 'WECHAT');
    $.ajax({
        url: 'http://192.168.199.103:8000/pay/pre',
        headers: {'AccessToken': sess},
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            if (data.status === 0) {
                var _url = data.data;
                console.log('WECHAT' + JSON.stringify(_url));

                var wxPay = api.require('wxPay');
                wxPay.payOrder({
                    apiKey: data.data['appid'],
                    orderId: data.data['prepayid'],
                    mchId: data.data['partnerid'],
                    nonceStr: data.data['noncestr'],
                    timeStamp: data.data['timestamp'],
                    package: data.data['package'],
                    sign: data.data['sign']
                }, function (ret, err) {
                    if (ret.status) {
                        //支付成功
                    } else {
                        alert(err.code);
                    }
                });
            }
        }
    })

};

window.goAlipay = () => {

    myApp.showPreloader('即将支付。。。');
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var sess = userInfo['session'];
    var fd = new FormData();
    fd.append('store_id', 1);
    fd.append('cash_total', 1);
    fd.append('value_total', 0);
    fd.append('pay_type', 'ALIPAY');
    $.ajax({
        url: 'http://192.168.199.103:8000/pay/pre',
        headers: {'AccessToken': sess},
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
            if (data.status === 0) {
                var _url = data.data.url;
                console.log(_url);

                // _url = 'partner="2088101568358171"&seller_id="xxx@alipay.com"&out_trade_no="0819145412-6177"&subject="测试"&body="测试测试"&total_fee="0.01"&notify_url="https://osiris.leanapp.cn/auth/notify/alipay"&service="mobile.securitypay.pay"&payment_type="1"&_input_charset="utf-8"&it_b_pay="30m"&sign="lBBK%2F0w5LOajrMrji7DUgEqNjIhQbidR13GovA5r3TgIbNqv231yC1NksLdw%2Ba3JnfHXoXuet6XNNHtn7VE%2BeCoRO1O%2BR1KugLrQEZMtG5jmJIe2pbjm%2F3kb%2FuGkpG%2BwYQYI51%2BhA3YBbvZHVQBYveBqK%2Bh8mUyb7GM1HxWs9k4%3D"&sign_type="RSA"';

                var aliPayPlus = api.require('aliPayPlus');
                myApp.hidePreloader();
                aliPayPlus.payOrder({
                    orderInfo: _url
                }, function (ret, err) {
                    api.alert({
                        title: '支付结果',
                        msg: ret.code,
                        buttons: ['确定']
                    });
                });

            }
        }
    })

}

window.apiready = function () {

    //

}



/**
 * Created by dingyuxuan on 2017/4/5.
 */

let Login_ = () => {

    if (localStorage.getItem('userInfo') !== null && JSON.parse(localStorage.getItem('userInfo')) !== undefined) {
        mainView.router.loadPage('index2.html');
    }
    $('#send-sms').on('click', function () {
        let phone = $('#login').val().trim();
        if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/i.test(phone)) {
            server.getVerityCode(phone, function (ret, err) {
                if (err) {
                    myApp.alert('网络出错', '错误');
                    return
                }

                if (ret.status === 0) {
                    $('#send-sms').attr('disabled', true);
                    myApp.alert('验证码已经发送，请耐心等待');
                    setTimeout(function () {
                        $('#send-sms').attr('disabled', false);
                    }, 15 * 60 * 1000);
                } else {
                    myApp.alert(ret.msg, '错误')
                }
            })
        } else {
            myApp.alert('手机号格式不正确', '错误');
        }
    });

    $('#login-button').on('click', function () {
        let phone = $('#login').val().trim(),
            vcode = $('#password').val().trim();

        if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/i.test(phone)) {
            if (/^[0-9]{6}$/i.test(vcode)) {
                server.login(phone, vcode, function (ret, err) {
                    if (err) {
                        myApp.alert(JSON.stringify(err), '错误');
                        return
                    }

                    if (ret.status === 0) {
                        localStorage.setItem('userInfo', JSON.stringify(ret.data));
                        updateUserInfo();
                        mainView.router.loadPage('index2.html');
                    } else {
                        myApp.alert(ret.msg, '错误')
                    }
                })
            } else {
                myApp.alert('验证码错误', '错误');
            }
        } else {
            myApp.alert('手机号格式不正确', '错误');
        }
    })

};

export default Login_;

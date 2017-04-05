/**
 * Created by dingyuxuan on 2017/4/5.
 */

let personSetting_ = () => {

    if (localStorage.getItem('userInfo') !== null && JSON.parse(localStorage.getItem('userInfo')) !== undefined) {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));

        let person_userImg = $('#person-userImg');
        if (userInfo['head_img'] !== '') {
            person_userImg.attr('src', userInfo['head_img']);
        }

        person_userImg.off('click');
        person_userImg.on('click', function () {
            api.actionSheet({
                cancelTitle: '取消',
                buttons: ['拍照', '打开相册']
            }, function (ret, err) {
                if (ret.buttonIndex == 3) {
                    return
                }

                let sourceType = (ret.buttonIndex == 1) ? 'camera' : 'album';
                api.getPicture({
                    sourceType: sourceType,
                    allowEdit: true,
                    quality: 70,
                    targetWidth: 100,
                    targetHeight: 100
                }, function (ret, err) {
                    if (ret) {
                        if (ret.data) {
                            //alert(ret.data);
                            let avatarPath = api.fsDir + '/' + Date.parse(new Date()) + '.jpg';
                            let fs = api.require('fs');
                            fs.rename({
                                oldPath: ret.data,
                                newPath: avatarPath
                            }, function (ret, err) {
                                if (ret.status) {
                                    server.uploadHeadImg(avatarPath, function (ret, err) {
                                        if (err) {
                                            alert(JSON.stringify(err));
                                        } else {
                                            alert(JSON.stringify(ret));
                                        }
                                    });
                                    person_userImg.attr('src', avatarPath);
                                    userInfo['head_img'] = avatarPath;
                                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                                    updateUserInfo();
                                } else {
                                    api.alert({msg: err.msg});
                                }
                            });
                        }
                    } else {
                        api.alert({msg: err.msg});
                    }
                })
            })
        })

    }

};

export default personSetting_;

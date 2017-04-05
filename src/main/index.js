/**
 * Created by dingyuxuan on 2017/3/15.
 */

window.apiready = () => {

    let ajpush = api.require('ajpush');
    let db, dbName = 'o2o_db', tableName = 'o2o_tblMessage';
    let openDB = () => {
        db = api.require('db');
        db.openDatabase({
            name: dbName
        }, function (ret, err) {
            db.executeSql({
                name: dbName,
                sql: 'CREATE TABLE ' + tableName + '(type int, msg varchar, receiveTime varchar)'
            });
        });
    };

    ajpush.init((ret) => {
        if (ret && ret.status) console.log("jpush: " + JSON.stringify(ret))
    });
    ajpush.getRegistrationId((ret) => {
        let registrationId = ret.id;
        console.log("jpush-id: " + registrationId);
    });

    api.setStatusBarStyle({style: 'dark'});

    let firstHeaderDom = $api.byId('header');
    $api.fixStatusBar(firstHeaderDom);
    let firstHeaderDomH = $api.offset(firstHeaderDom).h;
    console.log('H:   ' + firstHeaderDomH);

    let welcomeShowed = $api.getStorage('welcomeShowed');
    if (welcomeShowed) {
        api.openFrame({
            name: 'main',
            //url: './html/home.html',
            //url: 'http://qbptj8.natappfree.cc',
            url: 'app/index.html',
            rect: {
                x: 0,
                y: firstHeaderDomH,
                w: 'auto',
                h: api.frameHeight - firstHeaderDomH
            },
            bounces: false,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            progress: {
                style: 'default',
                title: '努力加载中...',
            },
            animation: {
                type: 'ripple',
                subType: 'from_right',
                duration: 2400,
            },
            pageParam: {key: ''},
            slidBackEnabled: false
        });
    } else {
        api.openFrameGroup({
            name: 'welcomeFrames',
            scrollEnabled: true,
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            index: 0,
            frames: [{
                name: 'welcome_frame_1',
                url: './html/welcomeFrame/one.html',
                bounces: false,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false
            }, {
                name: 'welcome_frame_2',
                url: './html/welcomeFrame/two.html',
                bounces: false,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false
            }, {
                name: 'welcome_frame_3',
                url: './html/welcomeFrame/three.html',
                bounces: false,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false
            }]
        }, (ret, err) => {
            let name = ret.name, index = ret.index;
        });

        $api.setStorage('welcomeShowed', '1');
    }

    openDB();

    ajpush.setListener(ret => {
            let id = ret.id, title = ret.title,
                content = ret.content, extra = ret.extra;
            console.log(id + " " + title + " " + content + " " + extra);
        }
    );

};

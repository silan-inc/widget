/**
 * Created by dingyuxuan on 2017/3/27.
 */

let Net = () => {

    let netHost = 'https://osiris.leanapp.cn';
    return {
        getVerityCode: (phone, callback) => {
            api.ajax({
                url: netHost + "/auth/verity",
                method: 'get',
                headers: {},
                data: {
                    values: {
                        phone: phone,
                    }
                }
            }, callback);
        },
        login: (phone, vcode, callback) => {
            api.ajax({
                url: netHost + "/auth/login",
                method: 'post',
                headers: {},
                data: {
                    values: {
                        phone: phone,
                        vcode: vcode,
                    }
                }
            }, callback);
        },
        uploadHeadImg: (path, callback) => {
            let userInfo = $api.getStorage('userInfo'),
                cellphone = userInfo['cellphone'],
                session = userInfo['session'];

            api.ajax({
                url: netHost + '/member/uploadHeadImg',
                method: 'post',
                headers: {
                    AccessToken: session,
                },
                data: {
                    files: {
                        file: path,
                    }
                }
            }, callback);
        },
        searchEngine: (option, callback) => {
            let data = {};
            if ("geo" in option) {
                data["filter"] = {
                    "geo_distance": {
                        "distance": option["geo"]["distance"],
                        "location": {
                            "lat": option["geo"]["lat"],
                            "lon": option["geo"]["lon"],
                        }
                    }
                };
                data["sort"] = [
                    {
                        "_geo_distance": {
                            "location": {
                                "lat": option["geo"]["lat"],
                                "lon": option["geo"]["lon"]
                            },
                            "order": "asc",
                            "unit": "km",
                            "distance_type": "plane"
                        }
                    }
                ]
            }

            let mustArray = [];
            Object.keys(option).forEach(e => {
                if (e && e != 'geo' && e != 'page') {
                    let obj = {"match": {}};
                    obj["match"][e] = option[e];
                    mustArray.push(obj);
                }
            });
            data["query"] = {"bool": {"must": mustArray}};

            if ("page" in option) {
                data["from"] = option["page"]["from"];
                data["size"] = option["page"]["size"];
            }

            api.ajax({
                url: netHost + '/api/store/search',
                method: 'post',
                headers: {},
                data: {
                    values: {
                        data: data
                    }
                }
            }, callback)
        }
    }

};

export default Net;

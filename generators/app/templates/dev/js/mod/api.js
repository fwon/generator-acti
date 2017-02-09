'use strict';

//项目接口
var _Promise = require('event').Promise;
var Toast = require('toast');
var toast = new Toast();
var BACK_HOST = '//g37-inner-vote.webapp.163.com';
var GAME_HOST = 'https://g37-active.nie.netease.com';

var ERROR_MSG_VOTE = [
    '投票成功',
    '',
    '投票券不足',
    '活动不存在',
    '活动未开启'
];

var ERROR_MSG_SER = {
    '400': "服务器已关闭",
    '401': "服务器已关闭",
    '402': "找不到该玩家",
    '403': "玩家不在线",
    '404': "网络错误"
};

//获取参数
function getUrlParam(q, str) {
    var val = '';
    var search = str || location.search || '?';
    search = search[0] === '?' ? search.substring(1) : search;
    if (search) {
        search = search.split('&');
        search.forEach(function(kv) {
            if (kv.indexOf(q + '=') === 0) {
                kv = kv.split('=');
                val = kv[1];
            }
        });
    }
    return val;
}

var GlobalApi = {
    //周边作品列表
    viewList: function(options) {
        var p = new _Promise();
        var api = BACK_HOST + '/view_list?';

        $.ajax({
            url: api + $.param({
                type: options.type || '',
                category: options.category || 'random', //random || hot
                page: options.page || 1,
                per_page_num: options.per_page_num || 9
            }),
            dataType: "jsonp",
            crossDomain: true,
            success:function(data) {
                if (data && data.success) {
                    p.resolve(data.apply_list, data.total_num);    
                } else {
                    p.reject(data.msg);
                }
            },
            error: function() {
                p.reject();
            }
        });

        return p;
    },
    //搜索周边
    search: function(options) {
        var p = new _Promise();
        var api = BACK_HOST + '/search?';

        $.ajax({
            url: api + $.param({
                search_key: options.search_key || '',
                page: options.page || 1,
                per_page_num: options.per_page_num || 9
            }),
            dataType: "jsonp",
            crossDomain: true,
            success:function(data) {
                if (data && data.success) {
                    p.resolve(data.apply_list, data.total_num);    
                } else {
                    p.reject(data.msg);
                }
            },
            error: function() {
                p.reject();
            }
        });

        return p;
    },
    //查看详情
    viewDetail: function(options) {
        var p = new _Promise();
        var api = BACK_HOST + '/view_detail?';

        $.ajax({
            url: api + $.param({
                id: options.id,
            }),
            dataType: "jsonp",
            crossDomain: true,
            success:function(data) {
                if (data && data.success) {
                    p.resolve(data.apply_info);    
                } else {
                    p.reject(data.msg);
                }
            },
            error: function() {
                p.reject();
            }
        });

        return p;
    },
    //排行榜
    topRank: function() {
        var p = new _Promise();
        var api = BACK_HOST + '/top_rank?';

        $.ajax({
            url: api,
            dataType: "jsonp",
            crossDomain: true,
            success:function(data) {
                if (data && data.success) {
                    p.resolve(data.apply_list);    
                } else {
                    p.reject(data.msg);
                }
            },
            error: function() {
                p.reject();
            }
        });

        return p;
    },
    //获取投票数量
    getVoteCount: function() {
        var p = new _Promise();
        var api = GAME_HOST + '/get_ticket_can_use?';
        var _role_id = getUrlParam('role_id');
        var _activity_id = getUrlParam('activity_id') || 59;
        var _server = getUrlParam('server') || 30001;

        if (!_role_id) {
            toast.show('未登录！');
            p.reject();
            return p;
        }

        $.ajax({
            url: api + $.param({
                server: _server,           //大区标识，测试使用30001
                role_id: _role_id,         //角色id
                activity_id: _activity_id  //活动id
            }),
            dataType:"json",
            success:function(data) {
                
                if (data && data.code) {
                    toast.show(ERROR_MSG_SER[data.code]);
                    p.reject();
                } else if (data && (data.count + 1)) {
                    p.resolve(data.count);
                } else {
                    toast.show('获取票数异常！');
                    p.reject();
                }
            },
            error: function() {
                p.reject();
            }
        });

        return p;
    },
    //用户投票, 游戏接口
    vote: function(id) {
        var p = new _Promise();
        var api = GAME_HOST + '/vote?';
        var _role_id = getUrlParam('role_id');
        var _activity_id = getUrlParam('activity_id') || 59;
        var _server = getUrlParam('server') || 30001;

        if (!_role_id) {
            toast.show('登录后才可投票！');
            p.reject();
            return p;
        }

        $.ajax({
            url: api + $.param({
                server: _server,           //大区标识，测试使用30001
                role_id: _role_id,         //角色id
                activity_id: _activity_id, //活动id
                vote_id: id                //作品id
            }),
            dataType:"json",
            success:function(data) {
                if (data && data.code) {
                    toast.show(ERROR_MSG_SER[data.code]);
                    p.reject();
                } else if (data && data.err_code) { //err_code为0时，直接跳到发奖
                    toast.show(ERROR_MSG_VOTE[data.err_code]);
                    p.reject();
                } else {
                    p.resolve(data);
                }
            },
            error: function() {
                toast.show('投票接口异常！');
                p.reject();
            }
        });

        return p;
    },
    //预加载图片
    preloadImg: function(urls) {
        urls.forEach(function(url) {
            var img = new Image();
            img.src = url;
        });
    }
};

module.exports = GlobalApi;
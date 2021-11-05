var workinfo, downloadurl;
(async () => {
    if(!getCookie('token') && getQueryString('token')){
        setCookie('token',getQueryString('token'),2)
    }
    let d;
    try {
        d = await getworkinfosync(getQueryString('id'));
    } catch (error) {
        alert('作品信息获取失败')
    }

    workinfo = d;
    window.scratchConfig.menuBar.customButtons[0].buttonName = workinfo.isauthor ? '保存' : '改编';
    if (d === undefined) {
        alert("未知错误")
        $(document).text("未知错误")
        return
    }
    if (!d.issign) {
        alert("请登录后查看")
        $(document).text("请登录后查看")
        location.href = mianhost+"/#page=sign"
        return
    }
    if (!(d.isauthor || (d.opensource && d.publish))) {
        alert("你没有权限，当前作品未开源或未发布")
        $(document).text("你没有权限，当前作品未开源或未发布")
        return
    }
    downloadurl = 'https://newsccode-1302921490.cos.ap-shanghai.myqcloud.com/work/' + d.id + '.json';
    // downloadurl = '/work/' + d.id + '.json';
    $('body').append('<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/52black/123@master/scratch/lib35.min.js"></script> \
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/52black/123@master/scratch/gui9.js"></script>')
})()
var scratch2 = () => { };
function save() {
    console.log("自定义按钮1");
    console.log('分享按钮');
    let data = new FormData(), data2 = [];

    window.scratch.getProjectCover(cover => {
        //TODO 获取到作品截图
        // console.log(cover);
        // data.append("covers", dataURLToBlob(cover));
    })
    window.scratch.getProjectFile(file => {
        //TODO 获取到项目文件
        console.log(file.toString());
        // data.append("scratch", file);
        let f = function (i) {
            i = new Blob([vm.assets[i].data], { type: vm.assets[i].assetType.contentType })
            console.log(URL.createObjectURL(i))
            return i
        }
        for (i in vm.assets) {
            // upload(i.data)
            if (!vm.assets[i].clean) {
                data.append('image', f(i))
                data2.push(i)
            }
        }
        function uplw(){
            let f = new FormData();
                    f.append("work", new Blob([vm.toJSON()]))
                    $.ajax({
                        url: apihost + 'upload/work?token='+getCookie('token')+'&id='+workinfo.id,
                        method: 'POST',
                        data: f,
                        cache: false,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        // 图片上传成功
                        success: function (result1) {
                            alert('作品保存成功')
                        },
                        error: function () {
                            alert("保存失败");
                            console.log('保存失败');
                        }
                    });
        }
        if (data2.length)
            $.ajax({
                url: apihost + 'uploads',
                method: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                // 图片上传成功
                success: function (result1) {
                    for (let i of data2) {
                        vm.assets[i].clean = true;
                    }
                    data2 = [];
                    alert('素材保存成功，保存作品中……')
                    uplw();
                },
                error: function () {
                    alert("保存失败");
                    console.log('保存失败');
                }
            });
        else uplw();
    })
}
function dataURLToBlob(dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

window.scratchConfig = {
    logo: {
        show: true
        , url: "/img/logo.png" //logo地址，支持base64图片
        , handleClickLogo: () => {
            console.log('点击LOGO');
            window.open("/");
        }
    },
    menuBar: {
        //菜单栏样式
        style: {
            background: 'hsla(215, 100%, 65%, 1)',
        },
        //新建按钮
        newButton: {
            show: true,
            handleBefore() {
                return true
            }
        },
        //从计算机加载按钮
        loadFileButton: {
            show: true,
            handleBefore() {
                return true
            }
        },
        //保存到计算机按钮
        saveFileButton: {
            show: true,
            handleBefore() {
                return true
            }
        },
        //加速模式按钮
        turboModeButton: {
            show: true
        },
        //教程按钮
        helpButton: {
            show: true,
            handleBefore: () => {
                console.log("显示自己的教程")
                return true
            }
        },
        //我的物品按钮
        myStuff: {
            show: true,
            url: '/myProject'
        },
        //用户头像按钮
        userAvatar: {
            show: true,
            username: '用户名',
            avatar: './static/avatar.png',
            handleClick() {
                //弹出登录框等操作
                console.log("点击头像")
            }
        },
        customButtons: [
            {
                buttonName: '',
                style: {
                    color: 'white',
                    background: 'hsla(30, 100%, 55%, 1)',
                },
                handleClick: () => {
                    save()
                }
                // 获取到项目名

            }
            //可继续新增按钮
        ]
    },
    blocks: {
        scale: 0.8, // 积木缩放比例
        // 隐藏分类
        // 分类代码:motion、looks、sound、events、control、sensing、operators、variables、myBlocks
        // 如需动态隐藏显示分类或积木，修改此配置后需手动执行 window.vm.emitWorkspaceUpdate()
        hideCatagorys: [],
        //隐藏积木
        /**积木代码：
          motion_movesteps  motion_turnright  motion_turnleft  motion_goto  motion_gotoxy  motion_glideto
          motion_glidesecstoxy  motion_pointindirection  motion_pointtowards  motion_changexby  motion_setx
          motion_changeyby  motion_sety  motion_ifonedgebounce  motion_setrotationstyle  motion_xposition  motion_yposition  motion_direction

          looks_sayforsecs  looks_say  looks_thinkforsecs  looks_think  looks_switchbackdropto  looks_switchbackdroptoandwait  looks_nextbackdrop
          looks_switchcostumeto  looks_nextcostume  looks_switchbackdropto  looks_nextbackdrop  looks_changesizeby  looks_setsizeto  looks_changeeffectby
          looks_seteffectto  looks_cleargraphiceffects  looks_show  looks_hide  looks_gotofrontback  looks_goforwardbackwardlayers  looks_backdropnumbername
          looks_costumenumbername  looks_backdropnumbername  looks_size

          sound_playuntildone  sound_play  sound_stopallsounds  sound_changeeffectby  sound_seteffectto  sound_cleareffects
          sound_changevolumeby  sound_setvolumeto  sound_volume

          event_whenflagclicked  event_whenkeypressed  event_whenstageclicked  event_whenthisspriteclicked  event_whenbackdropswitchesto
          event_whengreaterthan  event_whenbroadcastreceived  event_broadcast  event_broadcastandwait

          control_wait  control_repeat  control_forever  control_if  control_if_else  control_wait_until  control_repeat_until  control_stop
          control_create_clone_of  control_start_as_clone  control_create_clone_of  control_delete_this_clone  

          sensing_touchingobject  sensing_touchingcolor  sensing_coloristouchingcolor  sensing_distanceto  sensing_askandwait  sensing_answer
          sensing_keypressed  sensing_mousedown  sensing_mousex  sensing_mousey  sensing_setdragmode  sensing_loudness  sensing_timer  sensing_resettimer
          sensing_of  sensing_current  sensing_dayssince2000  sensing_username

          operator_add  operator_subtract  operator_multiply  operator_divide  operator_random  operator_gt  operator_lt  operator_equals  operator_and
          operator_or   operator_not  operator_join  operator_letter_of  operator_length  operator_contains  operator_mod  operator_round  operator_mathop
        */
        hideBlocks: [],
    },
    stageArea: { //舞台设置
        fullscreenButton: { //全屏按钮
            show: true,
            handleBeforeSetStageUnFull() { //退出全屏前的操作
                return true
            },
            handleBeforeSetStageFull() { //全屏前的操作
                return true
            }
        },
        startButton: { //开始按钮
            show: true,
            handleBeforeStart() { //开始前的操作
                return true
            }
        },
        stopButton: { // 停止按钮
            show: true,
            handleBeforeStop() { //停止前的操作
                return true
            }
        }
    },
    handleVmInitialized: (vm) => {
        window.vm = vm
        console.log("VM初始化完毕")
        $("#scratch").css("opacity", "0");
        $("#loadinfo").html('当前作品正在加载中');
    },
    handleProjectLoaded: () => {
        console.log("作品载入完毕")
        location.href="#id="+workinfo.id
    },
    handleDefaultProjectLoaded: () => {
        //默认作品加载完毕，可以在这里控制项目加载
        window.scratch.loadProject(downloadurl, (e) => {
            $("#scratch").css("opacity", "1");
            $('#view').hide();
            if (e === undefined) {
                console.log("项目加载完毕")
                for (let i in vm.assets) {
                    vm.assets[i].clean = true;
                }
            } else {
                alert("项目加载失败")
                console.log("项目加载失败")
                console.log(e);
            }
        })
    },
    //默认项目地址,不需要修请删除本配置项
    defaultProjectURL: "https://cdn.jsdelivr.net/gh/52black/xiaoyu@master/public/unreleased/scratch/8050135381552279031529",
    //若使用官方素材库请删除本配置项, 默认为/static下的素材库
    assetCDN: '/static'
}
var cdn = 'https://cdn.jsdelivr.net/gh/52black/xiaoyu@master/public/';
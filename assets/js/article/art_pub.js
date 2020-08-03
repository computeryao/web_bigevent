$(function () {
    initCate()
    var form = layui.form
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImageURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')
            .attr('src', newImageURL)
            .cropper(options)

    })

    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        var fd = new FormData(this)
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
               publishArticle(fd)

            })
    })
    function publishArticle(fd){
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0)return layer.msg(res.message)
                layer.msg(res.message)
                location.href='/article/art_list.html'
                // window.parent.document.getElementById('a2').click()
            }
           
        })
    }

})
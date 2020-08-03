$(function () {
    var form = layui.form
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })
    initCateList()

    $('body').on('submit', '.layui-form', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('添加分类失败！')
                initCateList()
                layer.msg('添加分类成功！')
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-eidt', res.data)
            }
        })
    })
    $('body').on('submit', '#form-eidt', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新分类数据失败')
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initCateList()
            }
        })
    })
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'get',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('删除失败！')
                layer.msg('删除成功！')
                layer.close(index)
                initCateList()
            }
        });
        })
    })

    function initCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('获取数据失败')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
})
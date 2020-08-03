$(function () {
    var form = layui.form
    var laypage = layui.laypage
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
              
                if (res.status !== 0) return layer.msg('获取数据失败！')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    function initCate(){
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0)return layer.mas('获取失败')
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                    form.render()
                    
            }
        })
    }
    template.defaults.imports.dateFormat = function (date) {
        var date = new Date(date);
        var y = padZero(date.getFullYear());
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());
        var hh = padZero(date.getHours());
        var mm = padZero(date.getMinutes());
        var dd = padZero(date.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + dd
    }
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    function renderPage(total){
        laypage.render({
            elem:'pageBox',
            count:total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump:function(obj,first){
                q.pagenum =obj.curr
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
            }
        })

    }
    $('tbody').on('click','.btn-del',function(){
        var id = $(this).attr('data-id')
        var len = $('.btn-del').length
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method:'get',
            url:'/my/article/delete/'+id,
            success:function(res){
                if(res.status!==0)return layer.msg(res.message)
                layer.msg('删除成功！')
                layer.close(index)
                if(len===1){
                    q.pagenum = q.pagenum===1? 1:q.pagenum-1
                }
                initTable()
            }

        })
      
    })
    })
})

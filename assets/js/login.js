$(function() {
    $('#links_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#links_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var val = $('.reg-box [name=password]').val()

            if (val !== value) return '两次密码不一致！'
        }
    })
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功');
                $('#form_reg')[0].reset()
                $('#links_login').click()
            }
        })
    })

    $('#form_login').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('登录成功');

                localStorage.setItem('token', res.token)
                location.href = '/index.html'

            }
        })
    })

})
if(window.jQuery===undefined)
    throw new Error("inputPwd插件依赖于jQuery");
jQuery.fn.inputPwd = function () {
    var $input = $(".fake-box input");
    $("#pwd-input").on("input", function() {
        var pwd = $(this).val().trim();
        for (var i = 0, len = pwd.length; i < len; i++) {
            $input.eq("" + i + "").val(pwd[i]);
        }
        $input.each(function() {
            var index = $(this).index();
            if (index >= len) {
                $(this).val("");
            }
        });
        if (len == 6) {
            //执行其他操作
        }
    });
}
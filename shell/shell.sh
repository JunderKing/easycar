#!/bin/bash
register (){
    echo "请输入手机号："
    read mobile
    echo "请输入密码："
    read passwd1
    while [ ${#passwd1} -le 6 ]
    do
        echo "密码至少需要6位字符！"
        read passwd1
    done
    echo "请再次输入密码："
    read passwd2
    while [ ${passwd1} != ${passwd2} ]
    do
        echo "两次输入的密码不一致！"
        read passwd2
    done
    echo "注册成功！"
    menu
}

login (){
    echo "请输入手机号："
    read mobile
    echo "请输入密码："
    read passwd
    echo "登陆成功！"
    echo -e "用户名：${mobile} \n密码：${passwd}"
}

menu (){
    echo "请选择（a-登陆, b-注册）："
    read answer
    if  [ ${answer} = "a" ]
    then
        echo "login"
        login
    elif [ ${answer} = "b" ]
    then
        echo "欢迎注册："
        register
    fi
}


menu

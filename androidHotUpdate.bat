@echo 人脸识别
@echo 自动化安卓热更新
::path1为vue项目绝对路径
set path1="D:\workProject\blockchain_wallet"
::path2为对应cordova项目绝对路径
set path2="D:\cordova\AcceWallet"
::path3为jdk安装目录
set path3="C:\Program Files\Java\jdk1.8.0_171\bin"
@echo vue打包开始
d:
call cd %path1%
call npm run build
@echo 复制打包好的文件到cordova中
call xcopy %path1%\wallet %path2%\www /s /y
@echo 开始热更新
call cd %path2%
call  cordova-hcp build

pause


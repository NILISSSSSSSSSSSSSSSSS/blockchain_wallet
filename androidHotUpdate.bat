@echo ����ʶ��
@echo �Զ�����׿�ȸ���
::path1Ϊvue��Ŀ����·��
set path1="D:\workProject\blockchain_wallet"
::path2Ϊ��Ӧcordova��Ŀ����·��
set path2="D:\cordova\AcceWallet"
::path3Ϊjdk��װĿ¼
set path3="C:\Program Files\Java\jdk1.8.0_171\bin"
@echo vue�����ʼ
d:
call cd %path1%
call npm run build
@echo ���ƴ���õ��ļ���cordova��
call xcopy %path1%\wallet %path2%\www /s /y
@echo ��ʼ�ȸ���
call cd %path2%
call  cordova-hcp build

pause


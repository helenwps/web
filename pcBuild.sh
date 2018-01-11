#创建临时目录
rm -rf build_temp
mkdir build_temp
cd build build_temp

echo "download web project ...."
git clone http://fywebpc:fywebpc123@192.168.10.81/pc/lawyer/web.git

echo "download ucenter project ...."
git clone http://fywebpc:fywebpc123@192.168.10.81/pc/lawyer/ucenter.git

echo "download orgCenter project ...."
git clone http://fywebpc:fywebpc123@192.168.10.81/pc/lawyer/orgCenter.git

echo "begin install npm packages..."

echo "install web project ..."
cd ./web
npm install

echo "install ucenter project ..."
cd ../ucenter
npm install

echo "install orgCenter project ..."
cd ../orgCenter
npm install

echo "end install packages"

echo "================="
echo "build starting.........."

cd ../web

#执行打包
sh ./build.sh

#删除目录
cd ../
rm -rf build_temp

echo "打包完成"
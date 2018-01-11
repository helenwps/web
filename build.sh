####
###编译打包脚本 执行 sh ./build.sh [push to git [version]] 进行打包
###  push to git 是否推送到git仓库   true false
###  version  打包版本，默认PC_V2.1.0
###  eg:  sh ./build.sh false PC_V2.1.1   //执行打包，不推送到git
###
version="PC_V2.1.0"

echo "编译开始，请等待..."
rm -rf ./dist

echo "start build web project..."
npm run build:prod

cd ../ucenter
echo "start build ucenter project..."
npm run build:prod

cd ../orgCenter
echo "start build orgCenter project..."
npm run build:prod

cd ../web
echo 'zip PC project'

if [ -n "$2" ] ;then
    version=$2
fi


cd ./dist
#执行打包
mkdir ../build_zip
node ../config/zipProject.js "$version"
# 默认不推送到git仓库
if [ "$1" = "true" ] ;then
    echo 'push to git'
    git init
    git remote add origin http://fywebpc:fywebpc123@192.168.10.81/pc/lawyer/lawyerRelease.git
    git pull origin master --allow-unrelated-histories
    rm -f ./$version.zip
    cp ../build_zip/$version.zip ./
    git add ./$version.zip
    git commit -m "add builded version $version PC project"
    git push origin master

    echo "打包好的文件已推送到git仓库"

    rm -rf ../build_zip
    else
        cp ../build_zip/$version.zip ./
        rm -rf ../build_zip
fi
https://gitcode.gitcode.host/docs-cn/lerna-docs-cn/commands/publish/index.html
# 创建包
```shell
lerna create
```
# 安装依赖
```shell
  pnpm add xx  --filter==@dfsj/xxx
``` 
# 清理依赖
```shell
lerna clean
``` 
# 查看管理的项目
```shell
lerna list  
```
# 运行所有包下面的script命令
```shell
lerna run --script
``` 

# 在所有包中运行该命令
```shell
lerna exec -- <command> [..args]
- 例子
  lerna exec --scope=npm-list  yarn remove lodash # 将 npm-list 包下的 lodash 卸载
  lerna exec -- yarn remove lodash # 将所有包下的 lodash 卸载

```

# version
```shell 
lerna version [major | minor | patch | premajor | preminor | prepatch | prerelease]
# uses the next semantic version(s) value and this skips `Select a new version for...` prompt
lerna notice cli v5.1.2
lerna info current version 1.0.0
lerna info Assuming all packages changed
? Select a new version (currently 1.0.0) (Use arrow keys)
❯ Patch (1.0.1)
  Minor (1.1.0)
  Major (2.0.0)
  Prepatch (1.0.1-alpha.0)
  Preminor (1.1.0-alpha.0)
  Premajor (2.0.0-alpha.0)
  Custom Prerelease
  Custom Version
```
# 发布
```shell
强制lerna publish   --force-publish
lerna publish --skip-git
lerna publish --no-git-tag-version
lerna publish --canary
# 1.0.0 => 1.0.1-alpha.0+${SHA} of packages changed since the previous commit
# a subsequent canary publish will yield 1.0.1-alpha.1+${SHA}, etc 
lerna publish --canary --preid beta
# 1.0.0 => 1.0.1-beta.0+${SHA} 
# The following are equivalent:
lerna publish --canary minor
lerna publish --canary preminor
# 1.0.0 => 1.1.0-alpha.0+${SHA} 

凸点 from-git
除了 lerna version 支持的 Semver 关键字外，lerna publish 还支持 from-git 关键字。这将标识由 lerna version 标记的包，并将它们发布到 NPM。这在 CI 场景中很有用，在这些场景中，你希望手动增加版本，但包内容本身由自动流程一致地发布。
凸点 from-package
与 from-git 关键字类似，除了通过检查每个 package.json 并确定注册表中是否不存在任何包版本来确定要发布的包的列表外。任何未出现在注册表中的版本都将被发布。当以前的 lerna publish 未能将所有包发布到注册中心时，这很有用。
```


# 发布流程（正式使用时会采取fixed统一版本模式，如果包太多了会难以独立管理包）
>  目前每个包的版本是独立设计的，所以每一次发布都会分别在git上面打标签。发布命令顺序如下
1、修改代码，rollup打包完成就绪；
2、本地提交、远程提交；
3、lerna changed  检查哪些包已经修改，可以配合 lerna diff
4、使用lerna version 更新版本（不要打标签）
5、lerna publish 发布
6、提交规范和自动生成changelog还需进一步配置优化，未启用
坑3：运行lerna publish如果中途有包发布失败，再运行lerna publish的时候，因为Tag已经打上去了，所以不会再重新发布包到NPM
解决办法：
1. 运行lerna publish from-git，会把当前标签中涉及的NPM包再发布一次，PS：不会再更新package.json，只是执行npm publish
2. 运行lerna publish from-package，会把当前所有本地包中的package.json和远端NPM比对，如果是NPM上不存在的包版本，都执行一次npm publish

# git(标签管理)
```shell
(mac os)
git tag -l | xargs git tag -d
git fetch
git tag -l | xargs -n 1 git push --delete origin
git tag -l | xargs git tag -d
(win)
git tag -l | ForEach-Object { git tag -d $_ }
git fetch
git tag -l | ForEach-Object { git push --delete origin $_ }
git tag -l | ForEach-Object { git tag -d $_ }
- 方法2
git fetch
git tag
git tag -d {tag-name}
git push origin :refs/tags/{tag-name}
```
# git(提交记录)
```shell
1. 创建一个新的空白分支：
   git checkout --orphan new_branch
2. 添加所有文件并进行提交：
   git add -A
   git commit -am "initial commit"
3. 强制推送该分支到远程仓库：
   git push -f origin new_branch
4. 将新分支合并到原来的分支上：
   git merge new_branch --allow-unrelated-histories
5. 重新设置HEAD到master分支上：
   git reset --hard origin/master
6. 强制推送到远程仓库：
   git push -f origin master
   git branch -m new_branch master
   git push origin master
``` 
 
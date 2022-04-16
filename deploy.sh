#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'music.suningyao.com' > CNAME

git init
git add -A
git commit -m '🔧'

# if you are deploying to https://<USERNAME>.github.io
git push -f https://github.com/fewwwww/music.suningyao.com.git master:gh-pages

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:fewwwww/suningyao.git master:gh-pages

cd -
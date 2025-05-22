git fetch --all
git reset --hard origin/main
npm install

HASH=$(git log -n1 --format="%h")
LONG_HASH=$(git log --pretty=format:'%H' -n 1)
sed -i 's@<li>For example, you can see the current commit of this website here: </li>@<li>For example, you can see the current commit of this website here: <a href="https://github.com/hackclub/athena-award/commit/'$LONG_HASH'">'$HASH'</a></li>@g' app/onboarding/page.tsx

npm run build
npm run start
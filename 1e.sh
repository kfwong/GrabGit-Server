REPO=$1

git -C '/var/www/grabgit/grabgit/git/'$REPO grep -Il '' | while read f; do git -C '/var/www/grabgit/grabgit/git/'$REPO blame --line-porcelain $f | grep '^author '; done | sort -f | uniq -ic | sort -rn | awk '{gsub("author ", ",");print}' | awk -F ',' 'BEGIN{print "name,value"}{gsub(/ /, "",$1);print $2","$1}'

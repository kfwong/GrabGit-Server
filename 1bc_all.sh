REPO=$1

rm -f /tmp/commit_history.out; git -C '/var/www/grabgit/grabgit/git/'$REPO --no-pager log --pretty=format:"%an" | sort -u | while read -r line;

do 
        git -C '/var/www/grabgit/grabgit/git/'$REPO log --numstat --author="$line" -i --pretty=format:"NEW_ENTRY%n%an %n%ae %n%cd %ncommitMsgStart%n%B%ncommitMsgEnd" --date=format:"%x, %d %b %Y %X" --reverse >> /tmp/commit_history.out 

done



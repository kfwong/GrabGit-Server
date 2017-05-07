REPO=$1
FROM_YEAR=$2
TO_YEAR=$3

rm -f /tmp/commit_history.out; git -C '/var/www/grabgit/grabgit/git/'$REPO --no-pager log --pretty=format:"%an" --since=$FROM_YEAR --until=$TO_YEAR | sort -u | while read -r line;

do 
        git -C '/var/www/grabgit/grabgit/git/'$REPO --no-pager log --numstat --author="$line" -i --pretty=format:"NEW_ENTRY%n%an %n%ae %n%cd %ncommitMsgStart%n%B%ncommitMsgEnd" --date=format:"%x, %d %b %Y %X" --reverse --since=$FROM_YEAR --until=$TO_YEAR >> /tmp/commit_history.out 

done



REPO=$1

echo "author,commits,additions,deletions"
git -C '/var/www/grabgit/grabgit/git/'$REPO log --format='%aN' | sort -u | 
while read -r authorName; 
do 
	echo -n $authorName',';
	git -C '/var/www/grabgit/grabgit/git/'$REPO log --shortstat --author="$authorName" | grep -E "fil(e|es) changed" | awk '{commits+=1; inserted+=$4; deleted+=$6} END {print commits","inserted","deleted }'; 
done

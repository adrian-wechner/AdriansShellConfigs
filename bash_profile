# BASH PROMPT
#
# instructions:
# copy content into => ~/.bash_profile
#


function git-branch-name {
  git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3-
}

function git-branch-path {
  local gitpath=`git rev-parse --show-toplevel 2>/dev/null` 
  local gitsuffix=`git rev-parse --show-prefix 2>/dev/null`
  local branch=`git-branch-name`

  if [ -n "$gitsuffix" ]; then gitsuffix=${gitsuffix%?}; else gitsuffix="~" ;fi
  if [ $branch ]; then printf "${gitpath##*/}:${gitsuffix}" ; else printf "\w" ; fi
}

function git-branch-prompt {
  local branch=`git-branch-name`
  if [ $branch ]; then printf " [%s]" $branch; fi
}

function re-prompt {
  PS1="\A \[\033[0;35m\]\[\033[0;36m\]$(git-branch-path)\[\033[0m\]\[\033[0;32m\]\$(git-branch-prompt)\[\033[0m\] \$ "
}
 
PROMPT_COMMAND=re-prompt
 
trap 're-prompt' DEBUG

# COPY THIS FILE INTO THE CUSTOM THEME FOLDER
# INSTALATION: cp THISFILE $ZSH/custom/themes/adrian.zsh-theme
# This theme is based on the oh-my-zsh default theme robbyrussell
# No license, have fun with it, I don't care.
# Any improvments are very welcome

function git-branch-name() {
  git symbolic-ref HEAD 2> /dev/null | cut -d"/" -f 3-
}

function prompt-path {
  local gitpath=`git rev-parse --show-toplevel 2>/dev/null` 
  local gitsuffix=`git rev-parse --show-prefix 2>/dev/null`
  local branch=`git-branch-name`
  local hpwd=`echo $HOME`
  local cpwd=`pwd`

  if [ -n "$gitsuffix" ]; then gitsuffix=${gitsuffix%?}; else gitsuffix="~" ;fi
  if [ $branch ]; then printf "${gitpath##*/}:${gitsuffix}" ; else printf ${cpwd//${hpwd}/\~} ; fi
}


PROMPT="%(?:%{$fg_bold[green]%}➜ :%{$fg_bold[red]%}➜ )"
PROMPT+='%{$reset_color%}%T'
PROMPT+=' %{$fg_bold[cyan]%}$(prompt-path)%{$reset_color%} $(git_prompt_info)'

ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[red]%}[%{$fg[red]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[red]%}] %{$fg[yellow]%}✗"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[red]%}]"


set backspace=2
set tabstop=2
set expandtab
set shiftwidth=2
set autoindent
set smartindent

syntax on

" Vim Plugin Management
call plug#begin('~/.vim/plugged')
  Plug 'flazz/vim-colorschemes'
  Plug 'jeffkreeftmeijer/vim-numbertoggle'
call plug#end()

" Activate Relative Numbers by default
" To unset type: set nonumber norelativenumbe
set number relativenumber
set cursorline
colorscheme molokai
hi LineNr ctermbg=NONE ctermfg=darkgrey
hi Visual ctermbg=darkgrey ctermfg=white

" Enable mouse mode for vim
set ttymouse=xterm2
set mouse=a


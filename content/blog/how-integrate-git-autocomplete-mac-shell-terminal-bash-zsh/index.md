---
title: How to integrate git in Mac OS Terminal (shell)
description: Now that zsh is the default shell on Mac OS terminal, you might want to setup you new Mac or VS Code terminal to have a smart integration with git, something similar to git bash for Windows.
date: 2022-03-11
tags:
  - tutorials
  - mac
  - zsh
  - git
---

Now that `zsh` is the default shell on Mac OS terminal, you might want to setup you new Mac or VS Code terminal to have a smart integration with `git`, something similar to [git bash](https://gitforwindows.org/) for Windows.


<figure>
	{% image "terminal.png", "Mac OS X Terminal app | blog-11ty git:(main) * git status | On branch main | Your branch is ahead of 'origin/main' by 1 commit. (use \"git push\" to publish your local commits) | Changes not staged for commit: | (use \"git add ‹file>...\" to update what will be committed) | (use \"git restore ‹file>...\" to discard changes in working directory) | modified: content/blog/how-integrate-git-autocomplete-mac-shell-terminal-bash-zsh/index.md | no changes added to commit (use \"git add\" and/or \"git commit -a\")", [648, 1296], "648px" %}
  <figcaption>Mac OS Terminal with git integration</figcaption>
</figure>

After searching around for a while and finding tools to integrate with `bash`, I finally found [this article](https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Zsh) that offers an explanation on how to integrate `git` with `zsh` in Mac OS Terminal (or shell).

Since `zsh` ships with a framework for getting information from version control systems, called [`vcs_info`](http://zsh.sourceforge.net/Doc/Release/User-Contributions.html#Version-Control-Information), you can include the branch name in the prompt on the right side, add these lines to your ~/.zshrc file:

```dot
autoload -Uz vcs_info
precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )
setopt prompt_subst
RPROMPT='${vcs_info_msg_0_}'
# PROMPT='${vcs_info_msg_0_}%# '
zstyle ':vcs_info:git:*' formats '%b'
```

Zsh is powerful enough that there are entire frameworks dedicated to making it better. One of them is called [`oh-my-zsh`](https://github.com/robbyrussell/oh-my-zsh). `oh-my-zsh`’s plugin system comes with powerful git tab-completion, and it has a variety of prompt "themes", many of which display version-control data.

You can install `oh-my-zsh` running fhe following command:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Enjoy your new `zsh` terminal integrated with `git` commands!

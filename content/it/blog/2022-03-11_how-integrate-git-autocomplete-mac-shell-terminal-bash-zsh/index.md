---
title: "Come integrare git nel Terminale (shell) di Mac OS"
description: "Ora che zsh è la shell predefinita sul terminale di Mac OS, potresti voler configurare il tuo nuovo Mac o il terminale di VS Code per avere un'integrazione intelligente con git, simile a git bash per Windows."
tags:
  - tutorials
  - mac
  - zsh
  - git
---

Ora che `zsh` è la shell predefinita sul terminale di Mac OS, potresti voler configurare il tuo nuovo Mac o il terminale di VS Code per avere un'integrazione intelligente con `git`, simile a [git bash](https://gitforwindows.org/) per Windows.


<figure>
	{% image "terminal.png", "App Terminale Mac OS X | blog-11ty git:(main) * git status | On branch main | Your branch is ahead of 'origin/main' by 1 commit. (use \"git push\" to publish your local commits) | Changes not staged for commit: | (use \"git add ‹file>...\" to update what will be committed) | (use \"git restore ‹file>...\" to discard changes in working directory) | modified: content/blog/how-integrate-git-autocomplete-mac-shell-terminal-bash-zsh/index.md | no changes added to commit (use \"git add\" and/or \"git commit -a\")", [648, 1296], "648px" %}
  <figcaption>Terminale Mac OS con integrazione git</figcaption>
</figure>

Dopo aver cercato in giro per un po' e aver trovato strumenti per l'integrazione con `bash`, ho finalmente trovato [questo articolo](https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Zsh) che spiega come integrare `git` con `zsh` nel Terminale (o shell) di Mac OS.

Poiché `zsh` viene fornito con un framework per ottenere informazioni dai sistemi di controllo versione, chiamato [`vcs_info`](http://zsh.sourceforge.net/Doc/Release/User-Contributions.html#Version-Control-Information), puoi includere il nome del branch nel prompt sul lato destro aggiungendo queste righe al tuo file `~/.zshrc`:

```dot
autoload -Uz vcs_info
precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )
setopt prompt_subst
RPROMPT='${vcs_info_msg_0_}'
# PROMPT='${vcs_info_msg_0_}%# '
zstyle ':vcs_info:git:*' formats '%b'
```

Zsh è così potente che esistono interi framework dedicati a migliorarlo. Uno di questi si chiama [`oh-my-zsh`](https://github.com/robbyrussell/oh-my-zsh). Il sistema di plugin di `oh-my-zsh` offre un potente autocompletamento (tab-completion) per git e dispone di una varietà di "temi" per il prompt, molti dei quali mostrano i dati del controllo versione.

Puoi installare `oh-my-zsh` eseguendo il seguente comando:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Goditi il tuo nuovo terminale `zsh` integrato con i comandi `git`!

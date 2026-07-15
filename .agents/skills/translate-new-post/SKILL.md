---
name: translate-new-post
description: Localizza automaticamente in italiano un nuovo post scritto in inglese, copiando gli asset e configurando correttamente il front matter.
---

Quando l'utente richiede di tradurre un nuovo blog post o quando viene aggiunto un nuovo post in `content/en/blog/` non ancora presente in `content/it/blog/`:

1. Identifica il nome della cartella del post (es. `YYYY-MM-DD_post-slug`) sotto `content/en/blog/`.
2. Crea la corrispondente cartella sotto `content/it/blog/`.
3. Copia tutti i file non-markdown (immagini, screenshot, slides, ecc.) dal percorso inglese a quello italiano.
4. Leggi il file `content/en/blog/<folder_name>/index.md`.
5. Traduci il front matter (`title`, `description`, `image_alt`) e il corpo in markdown in un italiano naturale e professionale:
   - Mantieni inalterati i tag e i parametri dei shortcode (es. `{% image %}`).
   - Racchiudi sempre i campi `title` e `description` del YAML front matter tra doppie virgolette (`"`) per evitare errori con i due punti (`:`).
6. Scrivi il post tradotto in `content/it/blog/<folder_name>/index.md`.
7. Esegui `npm run build` per verificare che la build completi con successo.

---
title: "Design di tabelle responsive e accessibili"
description: "Come far adattare una tabella potenzialmente larga ai dispositivi più piccoli, senza perdere leggibilità e accessibilità? Ecco semplici soluzioni per far apparire le tabelle come liste e le liste come tabelle, in un design responsive e accessibile."
tags:
  - techniques
  - accessibility
  - responsive web design
---

Come fare in modo che una tabella potenzialmente larga si adatti ai dispositivi più piccoli, senza perdere in leggibilità e accessibilità? Ecco alcune semplici soluzioni per far apparire le tabelle come liste e le liste come tabelle, all'interno di un design responsive e accessibile.

Ipotizziamo di avere una tabella HTML `<table>` contenente degli ordini, ognuno dei quali ha:

1. un'immagine
2. una descrizione
3. un prezzo

E abbiamo la necessità di far sì che:

- **appaia come una lista** su viewport piccole, tipicamente gli smartphone
- **appaia come una tabella** su viewport più grandi, come tablet e computer
- sia **accessibile** (vedi [accessibilità](https://www.w3.org/standards/webdesign/accessibility)), ad esempio per gli utenti non vedenti

## Il markup della tabella

Ecco il markup della tabella di partenza.

```html
<table>
  <thead>
    <tr>
      <th scope="col">Foto</th>
      <th scope="col">Descrizione</th>
      <th scope="col">Prezzo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="https://via.placeholder.com/70x100&text=Product"></td>
      <td>Descrizione</td>
      <td>EUR 12.345</td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/70x100&text=Product"></td>
      <td>Descrizione</td>
      <td>EUR 12.345</td>
    </tr>
  </tbody>
</table>
```

La soluzione in questo caso consiste nell'impostare `display: flex` sulle righe (`tr`), e poi orientare le celle in verticale usando `flex-direction: column`.

```css
tr {
  display: flex;
  flex-direction: column;
}

@media (min-width: 400px) {
  tr {
    flex-direction: row;
  }
}
```

E boom. Ecco l'esempio su CodePen.

<iframe loading="lazy" height="350" style="width: 100%;" scrolling="no" title="Table markup, list layout (on small viewports)" src="//codepen.io/verlok/embed/GeWXGy/?height=350&theme-id=light&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  Vedi la Pen <a href='https://codepen.io/verlok/pen/GeWXGy/'>Table markup, list layout (on small viewports)</a> di Andrea Verlicchi
  (<a href='https://codepen.io/verlok'>@verlok</a>) su <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Ma si tratta davvero di una tabella?

Il tag `table` è davvero quello corretto da usare in questo caso? Non è che forse lo abbiamo scelto solo per comodità di layout? In fin dei conti, non si tratta semplicemente di una **lista** di ordini? Allora perché non utilizzare invece un tag `ul`?

```html
<ul>
  <li>
    <div class="photo"><img src="https://via.placeholder.com/70x100&text=Product"></div>
    <div class="description">Descrizione</div>
    <div class="price">EUR 12.345</div>
  </li>
  <li>
    <div class="photo"><img src="https://via.placeholder.com/70x100&text=Product"></div>
    <div class="description">Descrizione</div>
    <div class="price">EUR 12.345</div>
  </li>
</ul>
```

In questo caso, nel CSS, dobbiamo solo allineare orizzontalmente i `div` all'interno degli elementi della lista (`li`), quando c'è abbastanza spazio per farlo.

```css
@media (min-width: 400px) {
  li {
    display: flex;
  }
}

div {
  padding: 10px;
}
```

Ecco il risultato:

<iframe loading="lazy" height="350" style="width: 100%;" scrolling="no" title="List markup, table layout (on large viewports)" src="//codepen.io/verlok/embed/pYeOwq/?height=350&theme-id=light&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  Vedi la Pen <a href='https://codepen.io/verlok/pen/pYeOwq/'>List markup, table layout (on large viewports)</a> di Andrea Verlicchi
  (<a href='https://codepen.io/verlok'>@verlok</a>) su <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Considerazioni sull'accessibilità

Le tabelle (`table`) possono essere estremamente accessibili se [sviluppate correttamente](https://webaim.org/techniques/tables/data), ma credo che abbia senso utilizzarle solo quando i dati in ogni singola cella hanno almeno 2 intestazioni (header): una all'inizio della colonna e una all'inizio della riga.

Se hai solo un titolo per ogni colonna e poche colonne in totale, probabilmente è meglio considerarla come una lista e scriverne il markup di conseguenza, usando `ul` o `ol` a seconda delle preferenze. Assicurati di fare la scelta corretta!

Infine, ma non meno importante: se utilizzi un markup non tabellare (`ul`, `div`, `span`) che viene mostrato visivamente come una tabella e desideri renderlo accessibile, assicurati di utilizzare i [ruoli ARIA (ARIA roles)](https://www.w3.org/TR/wai-aria-practices/examples/table/table.html) per definire `rowgroup`, `columnheader`, `rowheader`, `cell`, ecc.

## Conclusione

Puoi usare Flexbox per far sì che una tabella sembri una lista, o una lista sembri una tabella con grande facilità. Tieni sempre a mente l'accessibilità! Quando sviluppi tabelle reali, usa gli header per righe e colonne. Quando sviluppi pseudo-tabelle, usa i ruoli ARIA per definire chi fa cosa.

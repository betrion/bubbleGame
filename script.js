var nivo = 0;
var nivoId = document.querySelector("#nivo");
nivoId.innerText = nivo;
var maxNivo = 10;
var brojKrugovaNivo = [3, 10, 12, 14, 16, 18, 20, 22, 24, 26];
let vrijemeNivo = []; //dat ćemo neko razumno vrijeme za svaki level
brojKrugovaNivo.forEach((vrijeme) => {
  vrijemeNivo.push(vrijeme * 2);
});
console.log(vrijemeNivo);
let trenutnoVrijeme;
var boje = ["red", "blue", "green", "yellow"];
var generiraniKrugovi = [];
var randBoja, novi;
var pozicijaKlikaZaDrag = [];
var brojacVremena;
let objave = document.querySelector("#objava");
let glavniBotun = document.getElementById("startStop");
let crveniDimenzije = document.querySelector("#prvi").getBoundingClientRect();
let plavi = document.querySelector("#drugi").getBoundingClientRect();
let zeleni = document.querySelector("#treci").getBoundingClientRect();
let zuti = document.querySelector("#cetvrti").getBoundingClientRect();

function zapocniIgru() {
  promijeniBotun();
  ocistiKrugove();

  // promijeniNivo();
  generirajKrugoveNaRandomMjestima(brojKrugovaNivo[nivo - 1]);
}

function promijeniBotun() {
  console.log(glavniBotun.innerText);
  let trenutniTekst = glavniBotun.innerText;
  if (trenutniTekst == "Započni igru") {
    glavniBotun.innerText = "Igra u tijeku..";
    objave.innerText = "Igra počela..";
    glavniBotun.disabled = true;

    brojacVremena = setInterval(odbrojavaj, 1000);
  } else if (trenutniTekst == "Igra u tijeku..") {
    // brojacVremena = setInterval(odbrojavaj, 1000);
  }
}

function generirajKrugoveNaRandomMjestima(brojKrugova) {
  console.log(`Generirano je ${brojKrugova} krugova`);
  for (var i = 0; i < brojKrugova; i++) {
    randBoja = Math.floor(Math.random() * 4);
    randLeft = Math.floor(Math.random() * 90); //kasnije primjenjujemo kao postotke
    randTop = Math.floor(Math.random() * 90); //kasnije primjenjujemo kao postotke
    novi = document.createElement("div");
    novi.setAttribute("id", "bubble");
    novi.style.backgroundColor = boje[randBoja];
    novi.style.position = "absolute";
    novi.style.left = `${randLeft}%`;
    novi.style.top = `${randTop}%`;
    novi.style.width = "60px";
    novi.style.height = "60px";
    novi.style.borderRadius = "50%";
    novi.dragged = 0;
    novi.onmousedown = startDrag;

    document.body.appendChild(novi);

    /*
    u ovom dolje polju će biti svi krugovi generirani za pojedini nivo.
    Daklem, pomoću njega ćemo provjeravati na kraju nivo jeli svaki krug završio u pripadajući box (plavi, žuti, zeleni, crveni)
    Za to napraviti trebate još sami izvući(izračunati) top,bottom,left i right koordinate tih boxova
    pa napraviti funkciju za provjeru jeli svaki generirani krug unutar pripadajućeg boxa
    */
    generiraniKrugovi.push(novi);
  }
}

function zbrojiUspjesneKrugove() {
  /*
  stvori novu listu krugova
  filtriraj postojecu listu prema:
  prvo za crvene krugove
  upari krug koji ima crvenu boju sa daljnjom provjerom pozicije
  if krugx veci od rect.left manji od rect.right i krugy veci 

*/ let novikrugovi = [];
  generiraniKrugovi.forEach((krug) => {
    if (krug.style.backgroundColor === "red") {
      if (
        krug.getBoundingClientRect().x > crveniDimenzije.left &&
        krug.getBoundingClientRect().x + 60 < crveniDimenzije.right &&
        krug.getBoundingClientRect().y > crveniDimenzije.top &&
        krug.getBoundingClientRect().y + 60 < crveniDimenzije.bottom
      ) {
        novikrugovi.push(krug);
      }
    } else if (krug.style.backgroundColor === "blue") {
      if (
        krug.getBoundingClientRect().x > plavi.left &&
        krug.getBoundingClientRect().x + 60 < plavi.right &&
        krug.getBoundingClientRect().y > plavi.top &&
        krug.getBoundingClientRect().y + 60 < plavi.bottom
      ) {
        novikrugovi.push(krug);
      }
    } else if (krug.style.backgroundColor === "green") {
      if (
        krug.getBoundingClientRect().x > zeleni.left &&
        krug.getBoundingClientRect().x + 60 < zeleni.right &&
        krug.getBoundingClientRect().y > zeleni.top &&
        krug.getBoundingClientRect().y + 60 < zeleni.bottom
      ) {
        novikrugovi.push(krug);
      }
    } else if (krug.style.backgroundColor === "yellow") {
      if (
        krug.getBoundingClientRect().x > zuti.left &&
        krug.getBoundingClientRect().x + 60 < zuti.right &&
        krug.getBoundingClientRect().y > zuti.top &&
        krug.getBoundingClientRect().y + 60 < zuti.bottom
      ) {
        novikrugovi.push(krug);
      }
    }
  });
  return novikrugovi;
}
function pratiRezultat() {
  if (generiraniKrugovi.length === zbrojiUspjesneKrugove().length) {
    objave.innerText = "svi su krugovi u kvadratima! Kreće slijedeći level..";
    // alert("svi su krugovi u kvadratima! Kreće slijedeći level..");
    generiraniKrugovi = generiraniKrugovi.splice(0, generiraniKrugovi.length);

    zapocniIgru();
  }
}

function odbrojavaj() {
  let trenutnoVrijeme = parseInt(document.getElementById("vrijeme").innerHTML);
  // let trenutnoVrijeme = vrijemeNivo[nivo];
  trenutnoVrijeme--;
  document.getElementById("vrijeme").innerHTML = trenutnoVrijeme;

  console.log(trenutnoVrijeme);
  if (trenutnoVrijeme == 0) {
    pratiRezultat();
    // clearInterval(brojacVremena); //napravite funkciju
    objave.innerText = "Kraj igre, isteklo vrijeme, pokušaj ponovo..";
    ocistiKrugove();
    clearInterval(brojacVremena); //napravite funkcijun
    nivoId.innerText = "1";
    nivo = 0;
    trenutnoVrijeme += parseInt(document.getElementById("vrijeme").innerHTML);
    glavniBotun.innerText = "Započni igru";
    glavniBotun.disabled = false;
  } else {
    pratiRezultat();
    // trenutnoVrijeme += 10;
  }
}

function startDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pozicijaKlikaZaDrag[0] = e.clientX;
  pozicijaKlikaZaDrag[1] = e.clientY;
  ovaj = e.target;
  ovaj.dragged = 1;
  ovaj.onmousemove = elementDrag;
  ovaj.onmouseup = closeDrag;

  // zakrpa kada se prebrzo povuče pointer, pa se klik otpusti izvan samog elementa
  // tada ova funkcija ubija pomicanje elementa
  ovaj.onmouseout = closeDragFix;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  if (ovaj.onmousemove == elementDrag && ovaj.dragged == 1) {
    // calculate the new cursor position:
    pozicijaKlikaZaDrag[2] = pozicijaKlikaZaDrag[0] - e.clientX;
    pozicijaKlikaZaDrag[3] = pozicijaKlikaZaDrag[1] - e.clientY;
    pozicijaKlikaZaDrag[0] = e.clientX;
    pozicijaKlikaZaDrag[1] = e.clientY;
    // set the element's new position:
    ovaj.style.top = ovaj.offsetTop - pozicijaKlikaZaDrag[3] + "px";
    ovaj.style.left = ovaj.offsetLeft - pozicijaKlikaZaDrag[2] + "px";
  }
}

function closeDrag(e) {
  // stop moving when mouse button is released:
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  ovaj.dragged = 0;
  ovaj.onmousemove = null;
  ovaj.onmouseup = null;
}

function closeDragFix(e) {
  // zakrpa kada se prebrzo povuče pointer, pa se klik otpusti izvan samog elementa
  // tada ova funkcija ubija pomicanje elementa
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  ovaj.dragged = 0;
  ovaj.onmousemove = null;
  ovaj.onmouseup = null;
}

function ocistiKrugove() {
  nivo += 1 ? nivo < 10 : (nivoId.innerText = "1");
  nivoId.innerText = nivo;
  let bubbles = document.querySelectorAll("#bubble");
  return bubbles.forEach((bubble) => bubble.remove());
}

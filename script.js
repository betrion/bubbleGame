var nivo = 1;
var nivoId = document.querySelector("#nivo");
nivoId.innerText = nivo;
var maxNivo = 10;
var brojKrugovaNivo = [4, 10, 12, 14, 16, 18, 20, 22, 24, 26];
var vrijemeNivo = 20;
var boje = ["red", "blue", "green", "yellow"];
var generiraniKrugovi = [];
var randBoja, novi;
var pozicijaKlikaZaDrag = [];
var brojacVremena;
// let crveni = document.querySelector("#prvi");
let crveniDimenzije = document.querySelector("#prvi").getBoundingClientRect();
let plavi = document.querySelector("#drugi").getBoundingClientRect();
let zeleni = document.querySelector("#treci").getBoundingClientRect();
let zuti = document.querySelector("#cetvrti").getBoundingClientRect();

function zapocniIgru() {
  promijeniBotun();
  generirajKrugoveNaRandomMjestima(brojKrugovaNivo[nivo - 1]);
}

function promijeniBotun() {
  console.log(document.getElementById("startStop").innerText);
  let trenutniTekst = document.getElementById("startStop").innerText;
  if (trenutniTekst == "Započni igru") {
    document.getElementById("startStop").innerText = "Provjeri rezultat";

    brojacVremena = setInterval(odbrojavaj, 1000);
  } else if (trenutniTekst == "Provjeri rezultat") {
    provjeriRezultat();
    document.getElementById("startStop").innerText =
      "Započni 2. nivo/pokušaj ponovno/itd ovosno o provjeri";
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

function provjeriRezultat() {
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
function gameOver() {
  if (generiraniKrugovi.length === provjeriRezultat().length) {
    console.log("svi su krugovi u kvadratima");
    generiraniKrugovi = generiraniKrugovi.splice(0, generiraniKrugovi.length);

    zapocniIgru();
  }
}

function odbrojavaj() {
  let trenutnoVrijeme = parseInt(document.getElementById("vrijeme").innerHTML);
  trenutnoVrijeme--;
  document.getElementById("vrijeme").innerHTML = trenutnoVrijeme;
  if (trenutnoVrijeme == 0) {
    gameOver();
    clearInterval(brojacVremena);
    gameOver(); //napravite funkciju
    provjeriRezultat();
    // alert("Kraj igre, isteklo vrijeme");
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

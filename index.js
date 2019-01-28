const express = require("express");
const dateFns = require("date-fns");
const body_parser = require("body-parser");
const app = express();
app.use(body_parser.json());

tab_reservation = [];

const makePwd = () => {
  let pwd = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";

  for (let i = 0; i <= 10 - 1; i++)
    pwd += possible.charAt(Math.floor(Math.random() * possible.length));

  return pwd;
};
const annulation = (date, slot, name, key) => {
  for (let i = 0; i <= tab_reservation.length - 1; i++) {
    if (tab_reservation[i].date === date) {
      if (
        tab_reservation[i].slots[slot].isAvailable === false &&
        tab_reservation[i].slots[slot].name === name &&
        tab_reservation[i].slots[slot].key_user === key
      ) {
        tab_reservation[i].slots[slot] = {
          isAvailable: true
        };
      } else {
        return "reservation not found";
      }
    }
  }
  return tab_reservation;
};
const reservation = (date, slot, name) => {
  let reservation2 = { isAvailable: true, name: "" };
  let key = makePwd();
  //console.log(reservation2);

  for (let i = 0; i <= tab_reservation.length - 1; i++) {
    if (tab_reservation[i].date === date) {
      //.log(tab_reservation[i].slots["1100"]);
      if (tab_reservation[i].slots[slot].isAvailable === true) {
        //reservation2 = { isAvailable: false, name: name };
        tab_reservation[i].slots[slot] = {
          isAvailable: false,
          name: name,
          key_user: key
        };
      } else if (tab_reservation[i].slots[slot].isAvailable === false) {
        return "Slot already booked";
      }
    }
    console.log(reservation2);
  }
  return tab_reservation;
};
const verification_date_push = (date, res) => {
  let result = dateFns.compareAsc(
    new Date(),
    new Date(
      date[0] + date[1] + date[2] + date[3],
      date[5] + date[6] - 1,
      date[8] + date[9]
    )
  );

  if (result === 1) {
    res.json("message : choose an other date");
    return false;
  } else {
    let jour = dateFns.format(
      new Date(
        date[0] + date[1] + date[2] + date[3],
        date[5] + date[6] - 1,
        date[8] + date[9]
      ),
      "iiii"
    );
    console.log(jour);
    if (jour === "Sunday") {
      res.json("message : Doc is closed Sunday");
    } else {
      return true;
    }
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to Doctolib");
});
app.get("/voir", (req, res) => {
  res.json(tab_reservation);
});

app.post("/cancel", (req, res) => {
  let result = annulation(
    req.body.date,
    req.body.slot,
    req.body.name,
    req.body.key
  );
  res.json(result);
});

app.get("/visits", (req, res) => {
  //es.send("Hello");
  //res.send(req.query.date);

  if (tab_reservation.length > 0) {
    let found = false;
    let reservation = {
      date: "",
      slots: {
        1000: { isAvailable: true },
        1030: { isAvailable: true },
        1100: { isAvailable: true },
        1130: { isAvailable: true },
        1400: { isAvailable: true },
        1430: { isAvailable: true },
        1500: { isAvailable: true },
        1530: { isAvailable: true },
        1600: { isAvailable: true },
        1630: { isAvailable: true },
        1700: { isAvailable: true },
        1730: { isAvailable: true }
      }
    };
    for (let i = 0; i <= tab_reservation.length - 1; i++) {
      //console.log("valeur de i", i);

      if (tab_reservation[i].date === req.query.date) {
        found = true;
        //console.log(found);
        //console.log("deja exitant pas de modification");
      }
      //res.json(tab_reservation);
    }
    if (found === false) {
      //console.log(reservation.date);

      reservation.date = req.query.date;
      //console.log(found);
      //console.log(reservation);
      tab_reservation.push(reservation);
      //.log("n'existe pas je jai un push");
      //res.json(tab_reservation);
    }
  } else {
    let reservation = {
      date: "",
      slots: {
        1000: { isAvailable: true },
        1030: { isAvailable: true },
        1100: { isAvailable: true },
        1130: { isAvailable: true },
        1400: { isAvailable: true },
        1430: { isAvailable: true },
        1500: { isAvailable: true },
        1530: { isAvailable: true },
        1600: { isAvailable: true },
        1630: { isAvailable: true },
        1700: { isAvailable: true },
        1730: { isAvailable: true }
      }
    };
    reservation.date = req.query.date;
    tab_reservation.push(reservation);
    //console.log("tableau vide je push");
  }
  res.json(tab_reservation);
});

app.post("/visits", (req, res) => {
  let verif_date = verification_date_push(req.body.date, res);
  if (verif_date === true) {
    //console.log(req.body);
    if (
      req.body.slot === "1000" ||
      req.body.slot === "1030" ||
      req.body.slot === "1100" ||
      req.body.slot === "1130" ||
      req.body.slot === "1400" ||
      req.body.slot === "1430" ||
      req.body.slot === "1500" ||
      req.body.slot === "1530" ||
      req.body.slot === "1600" ||
      req.body.slot === "1630" ||
      req.body.slot === "1700" ||
      req.body.slot === "1730"
    ) {
      let result = reservation(req.body.date, req.body.slot, req.body.name);
      if (result === "Slot already booked") {
        res.status(400).send(result);
      } else {
        res.json(result);
      }
    } else {
      res.status(400).send("Bad request verifier l'heure de rdv");
    }
  }
});

// Remarquez que le `app.listen` doit se trouver après les déclarations des routes
app.listen(3000, () => {
  console.log("Server has started");
});

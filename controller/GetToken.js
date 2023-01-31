
const CryptoJS = require('crypto-js');

const SUMARIO = {
  "hora": {
    "A": [1, 'L'],
    "B": [2, 'A'],
    "C": [4, 'B'],
    "D": [5, 'C'],
    "E": [3, 'D'],
    "F": [7, 'E'],
    "G": [2, 'F'],
    "H": [3, 'G'],
    "I": [6, 'H'],
    "J": [4, 'I'],
    "K": [5, 'J'],
    "L": [6, 'K'],
  },
  "minuto": {
    "A": [85, 'L', 58, 2],
    "B": [80, 'A', 0, 0],
    "C": [88, 'B', 8, 12],
    "D": [78, 'C', 0, 0],
    "E": [95, 'D', 18, 22],
    "F": [76, 'E', 0, 0],
    "G": [87, 'F', 28, 32],
    "H": [79, 'G', 0, 0],
    "I": [81, 'H', 38, 42],
    "J": [77, 'I', 0, 0],
    "K": [94, 'J', 48, 52],
    "L": [75, 'K', 0, 0],
  },
  "concatenador": ["B", ';', '[', '*', ':', '/', ')', '5', '9', ','],
};

var Gdata;
var Ghora;
var Gminuto;

class GetToken {

  setValues() {
    const options = {
      timeZone: 'America/Sao_Paulo',
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: 'numeric',
      minute: 'numeric'
    };

    const date = new Intl.DateTimeFormat([], options);

    var now = date.format();

    var nowData = now.split(", ")[0];
    var nowTime = now.split(", ")[1];

    Gdata = "";
    Gdata += nowData.split("/")[2] + "-";
    Gdata += (parseInt(nowData.split("/")[0]) < 10 ? "0" : null) + nowData.split("/")[0] + "-";
    Gdata += nowData.split("/")[1];

    Ghora = nowTime.split(":")[0];
    Gminuto = nowTime.split(":")[1].split(" ")[0];

  }

  opterValor(time, interseção, targetL, targetC, targetR, center, targetOpt) {
    var target = null;

    if (interseção) {
      if (time >= center && interseção == 2) {
        target = targetR;
      } else if (time < center && interseção == 1) {
        target = targetL;
      } else {
        target = targetC;
      }

    } else {
      target = targetC;
    }

    var number = SUMARIO[targetOpt][target];

    return number[0];

  }

  encryp() {
    this.setValues();
    var hora = this.descripWithHour();
    var minuto = this.descripWithMinute();

    console.log(hora);
    console.log(minuto);

    var keyBase = (hora * 142857).toString();

    var keyParamiter = [
      parseInt(keyBase.slice(0, 2)),
      parseInt(keyBase.slice(2, 4)),
      [
        parseInt(keyBase.slice(4, 5)),
        parseInt(keyBase.slice(5, 6))
      ],
    ];

    var keySec = ((minuto / 10) + (keyParamiter[0] - 10)) * 100;
    var keyThird = minuto * keyParamiter[1];


    keySec += "";
    keySec = keySec.substr(0, 4);

    keyThird += "";
    keyThird = keyThird.substr(0, 4);

    var key = keyBase + "" + "" + keySec + "" + "" + keyThird;
    key = key.substr(0, keyParamiter[2][0]) + SUMARIO.concatenador[keyParamiter[2][1]] + key.substr(keyParamiter[2][0]);
    key = key.substr(0, keyParamiter[2][1]) + SUMARIO.concatenador[keyParamiter[2][0]] + key.substr(keyParamiter[2][1]);


    console.log(key);
    var iv = '8746376827619797';
    var encrypted = CryptoJS.AES.encrypt(
      Gdata,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(iv)
      }
    );

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }


  descripWithHour() {
    var hora = Ghora;
    var minuto = Gminuto;

    var interseção = 0;
    var values = null;

    if (minuto <= 2) {
      interseção = 1;
    } else if (minuto >= 58) {
      interseção = 2;
    }

    if (hora >= 0 && hora < 1) {
      values = this.opterValor(hora, interseção, "L", "A", "B", 0, "hora");
    }

    if (hora >= 1 && hora < 3) {
      values = this.opterValor(hora, interseção, "B", "C", "D", 2, "hora");
    }

    if (hora >= 3 && hora < 5) {
      values = this.opterValor(hora, interseção, "D", "E", "F", 4, "hora");
    }

    if (hora >= 5 && hora < 7) {
      values = this.opterValor(hora, interseção, "F", "G", "H", 6, "hora");
    }

    if (hora >= 7 && hora < 9) {
      values = this.opterValor(hora, interseção, "H", "I", "J", 8, "hora");
    }

    if (hora >= 9 && hora < 11) {
      values = this.opterValor(hora, interseção, "J", "K", "L", 10, "hora ");
    }

    if (hora >= 11 && hora <= 12) {
      values = this.opterValor(hora, interseção, "L", "A", "B", 12, "hora ");
    }

    return values;
  }

  descripWithMinute() {
    var minuto = Gminuto;

    var values = [null, null, null, null];

    if (minuto >= 0 && minuto < 5) {
      values = ["L", "A", "B", 0];
    }

    if (minuto >= 5 && minuto < 15) {
      values = ["B", "C", "D", 10];
    }

    if (minuto >= 15 && minuto < 25) {
      values = ["D", "E", "F", 20];
    }

    if (minuto >= 25 && minuto < 35) {
      values = ["F", "G", "H", 30];
    }

    if (minuto >= 35 && minuto < 45) {
      values = ["H", "I", "J", 40];
    }

    if (minuto >= 45 && minuto < 55) {
      values = ["J", "K", "L", 50];
    }

    if (minuto >= 55 && minuto <= 60) {
      values = ["L", "A", "B", 60];
    }

    var interseção = 0;
    var scaleL = SUMARIO.minuto[values[1]][2];
    var scaleR = SUMARIO.minuto[values[1]][3];

    if (minuto <= scaleL) {
      interseção = 1;
    } else if (minuto >= scaleR) {
      interseção = 2;
    }

    values = this.opterValor(minuto, interseção, values[0], values[1], values[2], values[3], "minuto");

    return values;
  }

}

module.exports = new GetToken();
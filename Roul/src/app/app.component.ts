import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Game = {id: number, time: number, number: string, gold: string};
type SortedObj = {index: number, number: string};

export class Obj {
  count: number = 0;
  constructor(public number: string, public color: string) {}
}

export class Sorted {
  counter: number = 0;
  arr: SortedObj[] = [];
  clear() {
    this.arr = [];
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  games: Game[] = [];
  firstMinCounter: number = 0;
  secondMinCounter: number;

  sortedList: SortedObj[] = [];

  consecutiveNumbers: { flag: boolean, num: number, required: number} = {
    flag: false,
    num: 0,
    required: 10
  };

  colorsCount = {
    green: 0,
    red: 0,
    black: 0
  };

  fields = [
    [
      { text: '1st 12', num: 0, min: false },
      { text: '2nd 12', num: 0, min: false },
      { text: '3rd 12', num: 0, min: false }
    ],
    [
      { text: '1st line', num: 0, min: false },
      { text: '2nd line', num: 0, min: false },
      { text: '3rd line', num: 0, min: false }
    ],
    [
      { text: '1 to 18', num: 0, min: false },
      { text: '19 to 36', num: 0, min: false }
    ],
    [
      { text: 'Even', num: 0, min: false },
      { text: 'Odd', num: 0, min: false }
    ]
  ];

  arrNumbers: Obj[] = [
    new Obj('1', 'red'), new Obj('2', 'black'), new Obj('3', 'red'),
    new Obj('4', 'black'), new Obj('5', 'red'), new Obj('6', 'black'),
    new Obj('7', 'red'), new Obj('8', 'black'), new Obj('9', 'red'),
    new Obj('10', 'black'), new Obj('11', 'black'), new Obj('12', 'red'),
    new Obj('13', 'black'), new Obj('14', 'red'), new Obj('15', 'black'),
    new Obj('16', 'red'), new Obj('17', 'black'), new Obj('18', 'red'),
    new Obj('19', 'black'), new Obj('20', 'black'), new Obj('21', 'red'),
    new Obj('22', 'black'), new Obj('23', 'red'), new Obj('24', 'black'),
    new Obj('25', 'red'), new Obj('26', 'black'), new Obj('27', 'red'),
    new Obj('28', 'red'), new Obj('29', 'black'), new Obj('30', 'red'),
    new Obj('31', 'black'), new Obj('32', 'red'), new Obj('33', 'black'),
    new Obj('34', 'red'), new Obj('35', 'black'), new Obj('36', 'red'),
  ];

  arrNullNumbers: Obj[] = [
    new Obj('0', 'green'), new Obj('00', 'green')
  ];

  arrAllNumbers: Obj[] = [];

  cellClicked = '';
  loader = {
    visible: false,
    op: false,
    container: false
  }

  timerObj: any = {
    minutes: 0,
    seconds: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initArrAllNumbers();
    this.getGames();
  }

  initArrAllNumbers() {
    this.arrAllNumbers.push(this.arrNullNumbers[0]);
    this.arrNumbers.forEach((el) => { this.arrAllNumbers.push(el); });
    this.arrAllNumbers.push(this.arrNullNumbers[1]);
  }

  numberWin(value: string): number {
    return value === '00' ? 37 : +value;
  }

  loaderFunc(flag) {
    if (flag) {
      this.loader.visible = this.loader.op = true;
      setTimeout(() => this.loader.container = true, 300);
    } else {
      this.loader.container = this.loader.op = false;
      setTimeout(() => {
        this.loader.visible = false;
        this.timer();
      }, 300);
    }
  }

  getGames() {
    this.loaderFunc(true);

    this.http.get('https://rovlpj.com/heroes/getter.php').subscribe((data: Game[]) => {
      this.games = data;
      // console.log(this.games);
      this.counterGames();
    });
  }

  counterGames() {

    this.arrAllNumbers.forEach((el) => el.count = 0);

    this.games.forEach((el, ind, arr) => {
      this.arrAllNumbers[this.numberWin(el.number)].count++;
    });

    this.counterFields();

    this.countingСolor();

    this.searchMinCounters();

    // console.log('firstMinCounter: ' + this.firstMinCounter);
    // console.log('secondMinCounter: ' + this.secondMinCounter);

    // console.log(this.arrNullNumbers);
    // console.log(this.arrNumbers);

    this.sortedListFunc();

    this.checkConsecutiveNumbers();

    this.loaderFunc(false);
  }

  searchFirstMinCounterFunc(el: Obj) {
    if (el.count < this.firstMinCounter) {
      this.firstMinCounter = el.count;
    }
  }

  searchSecondMinCounterFunc(el: Obj) {
    if (el.count < this.secondMinCounter && el.count > this.firstMinCounter) {
      this.secondMinCounter = el.count;
    }
  }

  searchMinCounters() {
    this.firstMinCounter = this.secondMinCounter = 2000;

    this.arrAllNumbers.forEach(this.searchFirstMinCounterFunc.bind(this));

    this.arrAllNumbers.forEach(this.searchSecondMinCounterFunc.bind(this));
  }

  sortedListFunc() {
    const flagArr: boolean[] = [];
    this.sortedList = [];

    for (let index = 0; index < 38; index++) {
      flagArr.push(false);
    }

    for (let index = 0; index < this.games.length; index++) {

      if (this.sortedList.length >= 38) {
        break;
      } else {

        const el = this.games[index];
        const elNum = this.numberWin(el.number);

        if (!flagArr[elNum]) {
          this.sortedList.push({
            index,
            number: el.number
          });
          flagArr[elNum] = true;
        }

      }
    }

    this.sortedList.sort((first, second) => {
      if (first.index > second.index) { return -1; }
      if (first.index < second.index) { return 1; }
    });
  }

  countingСolor() {
    this.colorsCount.green = this.colorsCount.red = this.colorsCount.black = 0;

    this.arrAllNumbers.forEach((el) => {
      switch (el.color) {
        case 'green': this.colorsCount.green += el.count; break;
        case 'red': this.colorsCount.red += el.count; break;
        case 'black': this.colorsCount.black += el.count; break;
      }
    });
  }

  checkConsecutiveNumbers() {
    this.consecutiveNumbers.flag = true;
    this.consecutiveNumbers.num = 1;

    const tempColor = this.arrAllNumbers[this.numberWin(this.games[0].number)].color;

    for (let i = 1; i < 24; i++) {
      const el = this.games[i];
      if (this.arrAllNumbers[this.numberWin(el.number)].color !== tempColor) {
        break;
      } else {
        this.consecutiveNumbers.num++;
      }
    }

    if (this.consecutiveNumbers.num < this.consecutiveNumbers.required) {
      this.consecutiveNumbers.flag = false;
    }
  }


  counterFields() {
    this.fields.forEach((el) => el.forEach((innEl) => {
      innEl.num = 0;
      innEl.min = false;
    }));

    this.arrNumbers.forEach(this.counterField.bind(this));

    // Находим max в областях
    this.fields.forEach((el) => {
      const tempArr: number[] = [];
      let tempMin: number = 0;

      el.forEach((innEl) => {
        tempArr.push(innEl.num);
      });

      tempMin = Math.min(...tempArr);

      el.forEach((innEl) => {
        if (innEl.num === tempMin) {
          innEl.min = true;
        }
      });
    });
  }

  counterField(el: Obj) {
    const number: number = +el.number,
      count: number = el.count;

    switch (true) {
      case (number >= 1 && number <= 12): this.fields[0][0].num += count; break;
      case (number >= 13 && number <= 24): this.fields[0][1].num += count; break;
      case (number >= 25 && number <= 36): this.fields[0][2].num += count; break;
    }

    switch (true) {
      case ((number % 3) === 1): this.fields[1][0].num += count; break;
      case ((number % 3) === 2): this.fields[1][1].num += count; break;
      case ((number % 3) === 0): this.fields[1][2].num += count; break;
    }

    switch (true) {
      case (number >= 1 && number <= 18): this.fields[2][0].num += count; break;
      case (number >= 19 && number <= 36): this.fields[2][1].num += count; break;
    }

    switch (true) {
      case (number % 2 === 0): this.fields[3][0].num += count; break;
      case (number % 2 === 1): this.fields[3][1].num += count; break;
    }
  }

  clickCell(ind: string) {
    this.cellClicked =
      this.cellClicked === ind
        ? ''
        : ind;
  }


  timer() {
    const nowDate = new Date(),
      minutes = nowDate.getMinutes(),
      seconds = nowDate.getSeconds(),
      remainderOfDivision = minutes % 10;

    let needS: number, temp: number;

    temp = remainderOfDivision < 6
      ? 6
      : 16;

    needS = (temp - (minutes % 10)) * 60 - seconds;

    // this.timerFunc(needS);

    this.timerObj.id = setInterval(() => {
      needS--;
      this.timerFunc(needS);
    }, 1000);
  }


  timerFunc(seconds) {
    if (seconds >= 0) {
      this.timerObj.seconds = seconds % 60;
      this.timerObj.minutes = Math.floor(seconds / 60);
    } else {
      clearInterval(this.timerObj.id);
      // Загружаем данные
      this.getGames();
    }
  }
}

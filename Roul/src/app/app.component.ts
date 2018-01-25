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

  getGames() {
    this.http.get('https://rovlpj.com/heroes/getter.php').subscribe((data: Game[]) => {
      this.games = data;
      // console.log(this.games);
      this.counterGames();
    });
  }

  counterGames() {

    this.games.forEach((el, ind, arr) => {
      this.arrAllNumbers[this.numberWin(el.number)].count++;
    });

    this.countingСolor();

    this.searchMinCounters();

    // console.log('firstMinCounter: ' + this.firstMinCounter);
    // console.log('secondMinCounter: ' + this.secondMinCounter);

    // console.log(this.arrNullNumbers);
    // console.log(this.arrNumbers);

    this.sortedListFunc();

    this.checkConsecutiveNumbers();
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
    console.log(this.firstMinCounter);

    this.arrAllNumbers.forEach(this.searchSecondMinCounterFunc.bind(this));
    console.log(this.secondMinCounter);
  }

  sortedListFunc() {
    let flagArr: boolean[] = [];
    for (let index = 0; index < 38; index++) {
      flagArr.push(false);
    }

    for (let index = 0; index < this.games.length; index++) {

      if (this.sortedList.length >= 38) {
        break;
      } else {

        const el = this.games[index];
        const elNum = el.number === '00' ? 37 : +el.number;

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
    // this.games[0] = this.games[2] = {time: 12312312, id: 598, number: '11', gold: '3413423'};
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

    if (this.consecutiveNumbers.num >= this.consecutiveNumbers.required) {

    } else {
      this.consecutiveNumbers.flag = false;
    }
  }

}

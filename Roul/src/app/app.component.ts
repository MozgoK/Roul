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
  // sortedList2: SortedObj[];

  arrNumbers: Obj[] = [
    // new Obj('0', 'green'), new Obj('00', 'green'),
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


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getGames();
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
      if (el.number === '0') {
        this.arrNullNumbers[0].count++;
      } else if (el.number === '00') {
        this.arrNullNumbers[1].count++;
      } else {
        this.arrNumbers[+el.number - 1].count++;
      }
    });

    this.searchMinCounters();

    // console.log('firstMinCounter: ' + this.firstMinCounter);
    // console.log('secondMinCounter: ' + this.secondMinCounter);

    // console.log(this.arrNullNumbers);
    // console.log(this.arrNumbers);

    // this.games.push({ id: 1, time: 123412, number: '00', gold: '123' });
    this.sortedListFunc();
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
    this.arrNullNumbers.forEach(this.searchFirstMinCounterFunc.bind(this));
    this.arrNumbers.forEach(this.searchFirstMinCounterFunc.bind(this));

    this.secondMinCounter = 2000;

    this.arrNullNumbers.forEach(this.searchSecondMinCounterFunc.bind(this));
    this.arrNumbers.forEach(this.searchSecondMinCounterFunc.bind(this));
  }

  sortedListFunc() {
    for (let index = 0; index < this.games.length; index++) {

      if (this.sortedList.length >= 38) {
        break;
      } else {

        const element = this.games[index];
        const elNum = element.number === '00' ? 37 : +element.number;

        if (!this.sortedList[elNum]) {
          this.sortedList[elNum] = {
            index,
            number: element.number
          };
        }
        // console.log(this.sortedList.length, element.number);
      }
    }
    // console.log(this.sortedList);

    this.sortedList.sort((first, second) => {
      if (first.index > second.index) { return -1; }
      if (first.index < second.index) { return 1; }
    });


    console.log(this.sortedList.length);
    this.sortedList.length = this.sortedList.reduce((sum, el) => {
      return sum + (el === undefined ? 0 : 1);
    }, 0);
    console.log(this.sortedList.length);
    // console.log(this.sortedList.reduce((sum, el) => {
    //   return el === undefined
    //     ? 0
    //     : 1;
    // }, 0));

    // this.sortedList2 = this.sortedList.map((el) => el);
    // console.log(this.sortedList2);
    // console.log(this.sortedList2.length);
    // this.sortedList2.length = 0;
    // console.log(this.sortedList2.length);
    // console.log(this.sortedList2[this.sortedList2.length - 2]);


  }

}

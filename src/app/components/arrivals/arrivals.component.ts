import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IRecord } from 'src/app/models/Record';
import { ArrivalsService } from 'src/app/services/arrivals.service';

@Component({
  selector: 'app-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.css']
})
export class ArrivalsComponent implements OnInit {

  constructor(private _arrivalsService: ArrivalsService) {
    this.minToday = this.today;
  }

  arrivals: IRecord[] = [];
  filteredArrivals: IRecord[] = [];
  field: string = '';
  sortAsc: boolean = true;
  dataLoaded: boolean = false;
  total_records: number = 0;
  total_is_late: number = 0;
  recordsLoaded: boolean = false;
  stateError: any = undefined;
  today: string = new Date().toISOString().slice(0, 16);
  minToday: string;

  @ViewChild('newArrival') newArrival!: NgForm;
  @ViewChild('fromTown') fromTown!: NgForm;
  @ViewChild('airline') airline!: NgForm;
  @ViewChild('dateInput') dateInput!: NgForm;
  @ViewChild('checkInput') checkInput!: NgForm;

  ngOnInit() {
    if (this.stateError) {
      alert(`${this.stateError} Please choose arrival from a list.`);
    }
    this._arrivalsService.getAllArrivals().subscribe(
      (res) => {
        this.arrivals = res;
        this.filteredArrivals = this.arrivals;
        this.dataLoaded = true;
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
    this.getArrivalsSum();
    this.getTotalIsLate();
  }

  onFilter($event: any): void {
    let inp = $event.target.value.toLocaleLowerCase();
    this.filteredArrivals = this.arrivals.filter(
      (pl) => pl.from_town.toLocaleLowerCase().indexOf(inp) != -1
    );
  }

  onSort(field: string): void {
    let fieldAsKey = field as keyof IRecord;
    this.field = field;
    if (this.sortAsc) {
      this.filteredArrivals.sort((a, b) => {
        return a[fieldAsKey] < b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    } else {
      this.filteredArrivals.sort((a, b) => {
        return a[fieldAsKey] > b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    }
  }

  addArrival() {
    if (this.newArrival.valid) {
      this._arrivalsService
        .createArrival({ is_late: 0, ...this.newArrival.value })
        .subscribe(
          (res) => {
            this.arrivals.push(res);
            this.filteredArrivals = this.arrivals;
            alert(
              `Plane from ${this.fromTown.value} (${this.airline.value}) successfuly added to DB!`
            );
            this.getArrivalsSum();
            this.getTotalIsLate();
          },
          (err) => console.log(err)
        );
    }
  }

  onDelete(id: number): void {
    this._arrivalsService.deleteArrival(id).subscribe(
      (res) => {
        alert(
          `Plane ${
            this.arrivals.find((pl) => pl.id == id)?.id
          } successfuly deleted from DB!`
        );
        this.arrivals = this.arrivals.filter((pl) => pl.id !== id);
        this.filteredArrivals = this.arrivals;
        this.getArrivalsSum();
        this.getTotalIsLate();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUpdate(arrival: IRecord): void {
    console.log(arrival.arrival_time);
    // arrival.arrival_time = arrival.arrival_time.slice(0,16);
    this._arrivalsService.updateArrival(arrival).subscribe(
      (res) => {
        alert(
          `Arrival ${
            this.arrivals.find((pl) => pl.id == arrival.id)?.id
          } successfuly updated in DB!`
        );
        console.log(res);
        this.getArrivalsSum();
        this.getTotalIsLate();
      },
      (err) => {
        alert(err.error.errors[0].msg);
      }
    );
  }

  getArrivalsSum() {
    this._arrivalsService.getRecordsSum().subscribe(
      (res) => {
        this.total_records = res.total_arrivals;
        this.recordsLoaded = true;
      },
      (err) => console.log(err)
    );
  }

  getTotalIsLate() {
    this._arrivalsService.getTotalIsLate().subscribe(
      (res) => {
        this.total_is_late = res.total_is_late;
      },
      (err) => console.log(err)
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
    return dformat;
  }



}

  // arrivals: Arrival[] = [];
  // arrivalsUpdateMap: Map<number, any> = new Map();
  // sortField: string = '';
  // direction: string = '';
  // @ViewChildren('newIs_late') newis_lateInputs: any;
  // @ViewChildren('todaysIs_lateCount') todaysIs_lateCountInputs: any;
  // @ViewChildren('newArrivalDate') newArrivalDateInputs: any;
  // newArrival: Arrival = { id: 0, from_town: '__', weight: 0, total_milk: 0, arrival_time: new Date() };

  // constructor(private arrivalsService: arrivalsService) { }

  // ngOnInit(): void {
  //   this.cowsService.getCows().subscribe(
  //     res => {
  //       this.cows = res; console.log(res);
  //       this.cows.forEach(cow => {
  //         let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date().toISOString() };
  //         this.cowsUpdateMap.set(cow.id, updateInfo);
  //       })
  //     },
  //     err => console.log(err)
  //   );
  // }

  // sortBy(field: string): void {
  //   let f = field as keyof Cow;
  //   if (this.direction == "up") {
  //     this.cows.sort((a, b) => a[f] > b[f] ? -1 : 0);
  //     this.direction = "down";
  //   } else {
  //     this.cows.sort((a, b) => a[f] < b[f] ? -1 : 0);
  //     this.direction = "up";
  //   }
  //   this.sortField = field;
  // }

  // onDelete(id: number): void {
  //   this.cowsService.deleteCow(id).subscribe(
  //     res => this.cows = this.cows.filter(c => c.id !== id),
  //     // TODO :: delete the update structure item for this cow
  //     err => console.log(err),
  //   );
  // }

  // onUpdate(cow: Cow): void {
  //   // id: number; name: string; weight: number; total_milk: number; last_milking_time: Date;
  //   // let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date() };
  //   let updatedData = this.cowsUpdateMap.get(cow.id);
  //   cow.weight = updatedData.newWeight !== 0 ? updatedData.newWeight : cow.weight;
  //   cow.total_milk = +updatedData.todaysMilkCount !== 0 ? cow.total_milk + +updatedData.todaysMilkCount : cow.total_milk;
  //   cow.last_milking_time = updatedData.newMilkingDate;

  //   // console.log(updatedData.newMilkingDate);
  //   // updatedData.newMilkingDate.toJSON().slice(0, 19).replace('T', ' ');


  //   // TODO :: validtion
  //   this.newMilkingDateInputs.forEach((c: any) => console.log(c.nativeElement.classList.contains('ng-invalid')))

  //   this.cowsService.updateCow(cow).subscribe(
  //     // if (this.newMilkingDateInputs)
  //     res => {
  //       this.newweightInputs.forEach((c: any) => c.nativeElement.value = 0);
  //       this.todaysMilkCountInputs.forEach((c: any) => c.nativeElement.value = 0);
  //       this.newMilkingDateInputs.forEach((c: any) => c.nativeElement.value = new Date().toISOString());
  //       let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date().toISOString() };
  //       this.cowsUpdateMap.set(cow.id, updateInfo);
  //     },
  //     err => console.log(err),
  //   );
  // }

  // onCreate(): void {
  //   console.log(this.newArrival);

  //   this.arrivalsService.createArrival(this.newArrival).subscribe(
  //     res => {
  //       this.ArrivalsService.getArrivals().subscribe(
  //         res => {
  //           this.Arrivals = res; console.log(res);
  //           this.Arrivals.forEach(arrival => {
  //             let updateInfo = { newWeight: 0, todaysMilkCount: 0, newArrivalDate: new Date().toISOString() };
  //             this.arrivalsUpdateMap.set(arrival.id, updateInfo);
  //           })
  //         },
  //         err => console.log(err)
  //       );
  //     },
  //     err => { }
  //   );
  // }


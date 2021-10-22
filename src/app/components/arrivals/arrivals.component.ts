import { Component, OnInit, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Arrival } from 'src/app/models/Arrival';
import { ArrivalsService } from 'src/app/services/arrivals.service';

@Component({
  selector: 'app-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.css']
})
export class ArrivalsComponent implements OnInit {

  arrivals: Arrival[] = [];
  arrivalsUpdateMap: Map<number, any> = new Map();
  sortField: string = '';
  direction: string = '';
  @ViewChildren('newIs_late') newis_lateInputs: any;
  @ViewChildren('todaysIs_lateCount') todaysIs_lateCountInputs: any;
  @ViewChildren('newArrivalDate') newArrivalDateInputs: any;
  newArrival: Arrival = { id: 0, from_town: '__', weight: 0, total_milk: 0, arrival_time: new Date() };

  constructor(private arrivalsService: arrivalsService) { }

  ngOnInit(): void {
    this.cowsService.getCows().subscribe(
      res => {
        this.cows = res; console.log(res);
        this.cows.forEach(cow => {
          let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date().toISOString() };
          this.cowsUpdateMap.set(cow.id, updateInfo);
        })
      },
      err => console.log(err)
    );
  }

  sortBy(field: string): void {
    let f = field as keyof Cow;
    if (this.direction == "up") {
      this.cows.sort((a, b) => a[f] > b[f] ? -1 : 0);
      this.direction = "down";
    } else {
      this.cows.sort((a, b) => a[f] < b[f] ? -1 : 0);
      this.direction = "up";
    }
    this.sortField = field;
  }

  onDelete(id: number): void {
    this.cowsService.deleteCow(id).subscribe(
      res => this.cows = this.cows.filter(c => c.id !== id),
      // TODO :: delete the update structure item for this cow
      err => console.log(err),
    );
  }

  onUpdate(cow: Cow): void {
    // id: number; name: string; weight: number; total_milk: number; last_milking_time: Date;
    // let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date() };
    let updatedData = this.cowsUpdateMap.get(cow.id);
    cow.weight = updatedData.newWeight !== 0 ? updatedData.newWeight : cow.weight;
    cow.total_milk = +updatedData.todaysMilkCount !== 0 ? cow.total_milk + +updatedData.todaysMilkCount : cow.total_milk;
    cow.last_milking_time = updatedData.newMilkingDate;

    // console.log(updatedData.newMilkingDate);
    // updatedData.newMilkingDate.toJSON().slice(0, 19).replace('T', ' ');


    // TODO :: validtion
    this.newMilkingDateInputs.forEach((c: any) => console.log(c.nativeElement.classList.contains('ng-invalid')))

    this.cowsService.updateCow(cow).subscribe(
      // if (this.newMilkingDateInputs)
      res => {
        this.newweightInputs.forEach((c: any) => c.nativeElement.value = 0);
        this.todaysMilkCountInputs.forEach((c: any) => c.nativeElement.value = 0);
        this.newMilkingDateInputs.forEach((c: any) => c.nativeElement.value = new Date().toISOString());
        let updateInfo = { newWeight: 0, todaysMilkCount: 0, newMilkingDate: new Date().toISOString() };
        this.cowsUpdateMap.set(cow.id, updateInfo);
      },
      err => console.log(err),
    );
  }

  onCreate(): void {
    console.log(this.newArrival);

    this.arrivalsService.createArrival(this.newArrival).subscribe(
      res => {
        this.ArrivalsService.getArrivals().subscribe(
          res => {
            this.Arrivals = res; console.log(res);
            this.Arrivals.forEach(arrival => {
              let updateInfo = { newWeight: 0, todaysMilkCount: 0, newArrivalDate: new Date().toISOString() };
              this.arrivalsUpdateMap.set(arrival.id, updateInfo);
            })
          },
          err => console.log(err)
        );
      },
      err => { }
    );
  }

}

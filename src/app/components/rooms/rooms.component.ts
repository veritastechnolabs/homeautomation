import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  mergeAll,
} from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice.service';
import { from, of } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  isLoadingb: boolean = true;
  isLoadingab: boolean = false;
  deviceData: any = [];
  errorMessage: boolean;
  devData: any;
  dev = [];
  roomnamedata = '';
  attdata: any = [];
  devForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private ds: DataserviceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RoomsComponent>,
    private sb: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { roomid: number; roomname: string }
  ) {}

  ngOnInit(): void {
    this.roomnamedata = this.data.roomname;

    this.ds.getdevicebyroomid(this.data.roomid).subscribe((res) => {
      if (res.success == 1) {
        this.isLoadingb = false;
        this.deviceData = res.data.results;
        this.deviceData.forEach((element) => {
          element.devices[0].data.forEach((ele) => {
            if (ele.value == 'ON') {
              ele.value = true;
            } else {
              ele.value = false;
            }
          });
        });
      }
    });
  }
  updateOnOff(value, Data) {

    var arr = [];
    Data.devices.forEach((el) => {
      arr = el.data.map((item) => {
        return {
          trait: item.attribute,
          value: item.value == true ? 'ON' : 'OFF',
        };
      });

    });
    var model = {
      devid: Data.manfdevid,
      commands: [
        {
          id: Data.devices[0].id,
          data: arr,
        },
      ],
    };
    this.isLoadingab = true;

    this.ds.updateOnOffstatus(model).subscribe((res) => {
      if (res.success == 1) {
        this.isLoadingab = false;
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getdeviceData(id) {
    this.ds.getdevbyid(id).subscribe((res) => {
      this.devData = res.data.results;
    });
  }
}

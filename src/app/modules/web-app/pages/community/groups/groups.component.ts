import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'vc-community-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  selectedItems = [];
  dropDownItems: any = [];
  form: FormGroup = new FormGroup({
    groupFilter: new FormControl()
  });

  constructor() {
  }

  ngOnInit(): void {
    this.dropDownItems = [
      {
        id: '1',
        filterName: 'Show All Groups',
        description: 'Show all available groups',
      },
      {
        id: '2',
        filterName: 'Show My Groups',
        description: 'Show groups that I am a member of',
      },
    ];

    this.form.get('groupFilter').setValue(this.dropDownItems[0]);

    this.form.get('groupFilter').valueChanges.subscribe((value) => {
        console.log('CONTROL UPDATE', value);
      }
    );
  }

  onItemSelected($event: any) {
    console.log($event);
  }
}

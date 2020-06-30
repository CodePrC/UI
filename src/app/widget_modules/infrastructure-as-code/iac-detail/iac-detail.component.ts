import {Component, Input, OnInit, Type} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { IClickListIACItem } from '../iac-detail/IClickListIACItem';
@Component({
  selector: 'app-iac-detail',
  templateUrl: './iac-detail.component.html',
  /*styleUrls: ['./iac-detail.component.sass']*/
})
export class IACDetailComponent implements OnInit {

  @Input() detailView: Type<any>;

  public data: Type<any>;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  @Input()
  set detailData(data: any) {
    this.data = data;
  }
}

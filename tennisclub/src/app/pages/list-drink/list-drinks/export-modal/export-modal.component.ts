import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  export(isSummary: boolean) {
    this.activeModal.close(isSummary);
  }
}

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable} from 'rxjs';
import {Fee} from '../fee';
import {FeeService} from '../fee.service';
import { RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {
  allFees: Fee[] = [];
  filteredFees: Fee[] = [];
  activeTab: 'draft' | 'approved' | 'live' = 'draft';

  constructor(private feeService: FeeService,
              private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.feeService.getFees().subscribe({
      next: (fees) => {
        console.log('Fees received from backend:', fees); // Debug log
        this.allFees = fees;
        this.filterFees();
      },
      error: (err) => console.error('Error fetching fees:', err)
    });
  }

  filterFees(): void {
    console.log('cw in filterFees');
    this.filteredFees = this.allFees.filter(fee => fee.status === this.activeTab);
  }

  onTabChange(status: 'draft' | 'approved' | 'live'): void {
    console.log('cw in onTabChange', status);
    this.activeTab = status;
    this.filterFees();
    this.cdr.detectChanges();
  }

  logFee(fee: any, origin: string): void {
    console.log(origin, ' Fee:', fee);
  }

}

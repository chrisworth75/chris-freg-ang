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
  tabTypes = [
    { id: 'draft', label: 'Draft' },
    { id: 'approved', label: 'Approved' },
    { id: 'live', label: 'Live' }
  ];

  activeTab: 'draft' | 'approved' | 'live' = 'draft';

  constructor(private feeService: FeeService,
              private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.feeService.getFees().subscribe({
      next: (fees) => {
        console.log('Fees received from backend:', fees); // Debug log
        this.allFees = fees;
      },
      error: (err) => console.error('Error fetching fees:', err)
    });
  }


  onTabChange(status: string): void {
    if (status === 'draft' || status === 'approved' || status === 'live') {
      this.activeTab = status;
    } else {
      console.warn('Invalid tab status:', status);
    }
  }


  filterFeesByTab(tab: string): any[] {
    return this.allFees.filter(fee => fee.status.toLowerCase() === tab);
  }



  logFee(fee: any, origin: string): void {
    console.log(origin, ' Fee:', fee);
  }

}

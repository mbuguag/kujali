import {Component,ChangeDetectionStrategy,inject,computed,effect,} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop'; // For RxJS to Signal conversion

import { cloneDeep as ___cloneDeep, flatMap as __flatMap } from 'lodash';
import { Observable, combineLatest } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import {
  Budget,
  BudgetRecord,
  BudgetStatus,
  OrgBudgetsOverview,
} from '@app/model/finance/planning/budgets';

import {
  BudgetsStore,
  OrgBudgetsStore,
} from '@app/state/finance/budgetting/budgets';

import { CreateBudgetModalComponent } from '../../components/create-budget-modal/create-budget-modal.component';
import { BudgetTableComponent } from '../../components/budget-table/budget-table.component'; // Import the standalone child

// Add modules needed by the template:

import { CommonModule } from '@angular/common';
import { MultiLangModule } from '@ngfi/multi-lang';

@Component({
  selector: 'app-select-budget',
  standalone: true, // MAX BONUS: Standalone
  changeDetection: ChangeDetectionStrategy.OnPush, // MAX BONUS: Zoneless Prep
  templateUrl: './select-budget.component.html',
  styleUrls: [
    './select-budget.component.scss',
    '../../components/budget-view-styles.scss',
  ],
  imports: [
    CommonModule,
    BudgetTableComponent,
    CreateBudgetModalComponent, // Assuming this is standalone or imported
    MatDialogModule,
    MatButtonModule,
    MultiLangModule,
    // Include all necessary modules/components used in the template (e.g., Kujali components)
  ],
})
// Removed implements OnInit
/** List of all active budgets on the system. */
export class SelectBudgetPageComponent {
  // 1. Modern DI (replace constructor)
  private _orgBudgets$$ = inject(OrgBudgetsStore);
  private _budgets$$ = inject(BudgetsStore);
  private _dialog = inject(MatDialog);
  private _logger = inject(Logger);

  // NOTE: Original overview$ and sharedBudgets$ are now private sources for toSignal
  private overviewSource$ = this._orgBudgets$$.get();
  private sharedBudgetsSource$ = this._budgets$$.get();

  // 2. Convert Source Observables to Signals
  overview = toSignal(this.overviewSource$);
  sharedBudgets = toSignal(this.sharedBudgetsSource$, {
    initialValue: [] as any[],
  });

  // 3. Convert combineLatest pipe into a computed signal (Declarative approach)
  allBudgetsData = computed(() => {
    // Read the current signal values synchronously
    const currentOverview = this.overview();
    const currentBudgets = this.sharedBudgets();

    // Safety check for initial null or empty values
    if (!currentOverview || !currentBudgets || !currentOverview.length) {
      return { overview: [], budgets: [] };
    }

    // Replicate the original pipe logic (mapping and flattening)
    const overviewFlat = __flatMap(currentOverview);
    const budgetsFlat = __flatMap(currentBudgets);

    const trBudgets = budgetsFlat.map((budget: any) => {
      budget['endYear'] = budget.startYear + budget.duration - 1;
      return budget;
    });

    return { overview: overviewFlat, budgets: trBudgets };
  });

  // Example effect for demonstration (replaces tap/logging)
  logBudgetEffect = effect(
    () => {
      const data = this.allBudgetsData();
      // This demonstrates using effect() for side effects
      // console.log(`[Effect] Budgets loaded: ${data.budgets.length}`);
    },
    { allowSignalWrites: true }
  ); // Use allowSignalWrites if updating state inside effect

  showFilter = false; // NOTE: ngOnInit() logic has been moved to property initializers.

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value; // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (any) => boolean) {
    // Adjusted type
    // this.filter$$.next(value);
  }

  toogleFilter(value: any) {
    // Adjusted type
    this.showFilter = value; // Original was commented out
  }

  openDialog(parent: Budget | false): void {
    const dialog = this._dialog.open(CreateBudgetModalComponent, {
      height: 'fit-content',
      width: '600px',
      data: parent != null ? parent : false,
    });

    // The subscription for dialog close is kept as it's an action-driven side effect
    dialog.afterClosed().subscribe(() => {
      // Dialog after action
    });
  }
  /**    * @TODO - Review and fix
   * Returns true if the budget can be activated */

  canPromote(record: BudgetRecord) {
    return (record.budget as any).canBeActivated;
  } /** Activate budget -> Promote to be used in  */

  setActive(record: BudgetRecord) {
    const toSave = ___cloneDeep(record.budget); // Clean up budget record values.

    delete (toSave as any).canBeActivated;
    delete (toSave as any).access; // Set Active

    toSave.status = BudgetStatus.InUse;

    (<any>record).updating = true; // Fire update (Subscription is acceptable for action-triggered side effects)
    this._budgets$$.update(toSave).subscribe(() => {
      (<any>record).updating = false;
      this._logger.log(
        () =>
          `Updated Budget with id ${toSave.id}. Set as an active budget for this org.`
      );
    });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { CreateBudgetModalComponent } from './components/create-budget-modal/create-budget-modal.component';
import { DisplayBudgetRecordComponent } from './components/display-budget-record/display-budget-record.component';
import { ShareBudgetModalComponent } from './components/share-budget-modal/share-budget-modal.component';
// import { BudgetTableComponent } from './components/budget-table/budget-table.component'; // REMOVED

import { SelectBudgetPageComponent } from './pages/select-budget/select-budget.component';

import { ChildBudgetsModalComponent } from './modals/child-budgets-modal/child-budgets-modal.component';

import { BudgetRouter } from './budget-router';

@NgModule({
  imports: [
    CommonModule,
    MaterialBricksModule,
    MaterialDesignModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    MultiLangModule,
    iTalPageModule,
    PageHeadersModule,

    BudgetsStateModule,

    BudgetRouter,
  ],

  declarations: [
    DisplayBudgetRecordComponent,
    CreateBudgetModalComponent,
    ShareBudgetModalComponent,

    SelectBudgetPageComponent,

    ChildBudgetsModalComponent,
  ],

  entryComponents: [CreateBudgetModalComponent, ShareBudgetModalComponent],
})
export class FinancialPlanningModule {}

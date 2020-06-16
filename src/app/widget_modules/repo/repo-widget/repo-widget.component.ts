import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {forkJoin, of, Subscription} from 'rxjs';
import {catchError, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { LayoutDirective } from 'src/app/shared/layouts/layout.directive';
import { WidgetComponent } from 'src/app/shared/widget/widget.component';
import { RepoService } from '../repo.service';
import { REPO_CHARTS} from './repo-charts';
import { IRepo } from '../interfaces';
import {CollectorService} from '../../../shared/collector.service';
// @ts-ignore
import moment from 'moment';
import * as _ from 'lodash';
import {MultiShowcaseLayoutComponent} from '../../../shared/layouts/multi-showcase-layout/multi-showcase-layout.component';

@Component({
  selector: 'app-repo-widget',
  templateUrl: './repo-widget.component.html',
  styleUrls: ['./repo-widget.component.scss']
})
export class RepoWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly REPO_PER_DAY_TIME_RANGE = 14;
  private readonly TOTAL_REPO_COUNTS_TIME_RANGES = [7, 14];
  // Reference to the subscription used to refresh the widget
  private intervalRefreshSubscription: Subscription;
  private params;
  @ViewChild(LayoutDirective, {static: false}) childLayoutTag: LayoutDirective;

  constructor(componentFactoryResolver: ComponentFactoryResolver,
              cdr: ChangeDetectorRef,
              dashboardService: DashboardService,
              route: ActivatedRoute,
              collectorService: CollectorService,
              private repoService: RepoService) {
    super(componentFactoryResolver, cdr, dashboardService, route);
  }

  // Initialize the widget and set layout and charts.
  ngOnInit() {
    this.widgetId = 'repo0';
    this.layout = MultiShowcaseLayoutComponent;
    this.charts = REPO_CHARTS;
    this.init();
  }

  // After the view is ready start the refresh interval.
  ngAfterViewInit() {
    this.startRefreshInterval();
  }

  ngOnDestroy() {
    this.stopRefreshInterval();
  }

  startRefreshInterval() {
    this.intervalRefreshSubscription = this.dashboardService.dashboardRefresh$.pipe(
      startWith(-1), // Refresh this widget separate from dashboard (ex. config is updated)
      distinctUntilChanged(), // If dashboard is loaded the first time, ignore widget double refresh
      // tslint:disable-next-line:no-shadowed-variable
      switchMap(_ => this.getCurrentWidgetConfig()),
      switchMap(widgetConfig => {
        if (!widgetConfig) {
          return of([]);
        }
        this.params = {
          componentId: widgetConfig.componentId,
          numberOfDays: 14
        };
        return forkJoin(
          this.repoService.fetchShowcase().pipe(catchError(err => of(err)))
		)
      })).subscribe((showcase) => {
      this.generateShowcase(showcase);
      super.loadComponent(this.childLayoutTag);
    });
  }

  // Unsubscribe from the widget refresh observable, which stops widget updating.
  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

  // *********************** REPO STATS PER DAY ************************
  generateShowcase(showcase) {
    if (showcase) {
      return;
    }
  }
}



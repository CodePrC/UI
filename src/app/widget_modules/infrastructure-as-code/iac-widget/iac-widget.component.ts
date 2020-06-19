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
import { Subscription, from} from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder} from '@angular/forms';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { LayoutDirective } from 'src/app/shared/layouts/layout.directive';
import { WidgetComponent } from 'src/app/shared/widget/widget.component';

import { CollectorService } from 'src/app/shared/collector.service';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import { IACService } from '../iac.service';
import { IAC_CHARTS } from './iac-charts';
import { TwoByTwoLayoutComponent } from 'src/app/shared/layouts/two-by-two-layout/two-by-two-layout.component';
import { interval, Observable} from 'rxjs';

@Component({
	selector: 'app-iac-widget',
	templateUrl: './iac-widget.component.html',
	styleUrls: ['./iac-widget.component.scss']
})
export class IACWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit, OnDestroy {

  // Reference to the subscription used to refresh the widget
  // private intervalRefreshSubscription: Subscription;
  @ViewChild(LayoutDirective, {static: false}) childLayoutTag: LayoutDirective;
  private intervalRefreshSubscription: Subscription;

// Refresh frequecy in ms, defaults to a min
	frequency: number = 10000;

	refresh: Observable<number>;

	observer: Observable<any>;

  constructor(componentFactoryResolver: ComponentFactoryResolver,
              cdr: ChangeDetectorRef,
              dashboardService: DashboardService,
              route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public collectorService: CollectorService,
              private iacService : IACService,
              config: NgbProgressbarConfig
  ) {
    super(componentFactoryResolver, cdr, dashboardService, route);

    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }

  ngOnInit() {
    this.widgetId = 'iac0';
    this.layout = TwoByTwoLayoutComponent;
    this.charts = IAC_CHARTS;
    this.init();
		this.refresh = interval(this.frequency);
		this.observer = this.refresh.pipe();

  }

  ngAfterViewInit() {
    this.startRefreshInterval();
  }

  ngOnDestroy() {
    this.stopRefreshInterval();
  }

  startRefreshInterval() {
    this.dashboardService.dashboardConfig$.pipe(
      map(result => {
        const widget = this.findWidget(result.widgets);
        return widget;
      })
    ).subscribe(result => {
      if (result) {
        this.widgetConfigSubject.next(result);
      }
    });

    this.populateNumberCardCharts();
    this.populateLineCharts();
    //this.populateBarCharts();

    super.loadComponent(this.childLayoutTag);
  }

  populateNumberCardCharts() {
	
	
		this.observer.subscribe(x => {
			this.iacService._GetTerraformCardDetails().subscribe((result => {
			    
				this.charts[1].data =result.data;
				 super.loadComponent(this.childLayoutTag);
				
			})
				, err => {
				}
			);
		});
  }
test = [];
i = 1;
j = 10;
  populateLineCharts() {
	
	
	
		this.iacService.
			_GetTerraformDetailAggregateRunRoute('', 'errored', 'WEEK', 4).subscribe(result => {
				from(result.data).pipe().subscribe(d => {
					let temp = { };
			
			
			temp['name'] = d['name'];
			temp['series'] = [
      {
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },
{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      },{
        "value": this.i+=100,
        "name": "2016-09-" + (this.j+=1) + ""
      }];
			
			
			this.test.push(temp); 
			 
			},
			 err => {
				
			}, () => {
				
				this.charts[0].data['dataPoints']= this.test;
				this.charts[0].data['areaChart']= true;
				 //super.loadComponent(this.childLayoutTag);
			});

	});
  }

  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

}



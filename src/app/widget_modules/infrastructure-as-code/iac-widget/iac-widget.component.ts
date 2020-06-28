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
import { IClickListIACItem } from '../iac-detail/IClickListIACItem';
import { DashStatus } from 'src/app/shared/dash-status/DashStatus';
import { IACDetailComponent } from '../iac-detail/iac-detail.component';
import { IClickListData, IClickListItem } from 'src/app/shared/charts/click-list/click-list-interfaces';

import { OneByTwoLayoutComponent } from '../../../shared/layouts/one-by-two-layout/one-by-two-layout.component';
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
	frequency: number = 100000;

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

load() {
		super.loadComponent(this.childLayoutTag);
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
interval(10000).subscribe((x => {
    this.populateNumberCardCharts();
    this.populateTerraformDetails();
    this.populateTerraformTrend();
this.load();
   
}),  err => console.log('HTTP Error', err) );
  () => {}}

	

  populateNumberCardCharts() {
	
	
	
	
		
			this.iacService._GetTerraformCardDetails().subscribe((result => {
				this.charts[0].data =result.data;
				
			})
				, err => {
				}
			);
		
 
		
  }
  populateTerraformTrend() {
		
			this.iacService._GetTerraformTrendDetails().subscribe((result=> {
				
				result = result.data;
				
					this.charts[1].data['dataPoints'] = result;
			
					
				 
				
				
				
				
				
			})
				, err => {
				}
			);
		
  }
test = [];
i = 1;
j = 10;
  populateTerraformDetails() {
	
	
			this.iacService._GetTerraformDetails().subscribe((result => {
			    
				result =result.data;
				
				console.log(result);

			let orgList = result['orgList'];

			let orgitems = [];

			from(orgList).subscribe(data => {

				let obj = {
					status: DashStatus.PASS,
					title:  data['name'],
					subtitles: null,
					workspaces: data['workSpaceList']

				} as IClickListIACItem;

				orgitems.push(obj);

			})

			this.charts[2].data = {'items' : orgitems, clickableContent: IACDetailComponent,  clickableHeader: null} as IClickListData;
				
				
			})
				, err => {} , 
				
				
			);

}

  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

}



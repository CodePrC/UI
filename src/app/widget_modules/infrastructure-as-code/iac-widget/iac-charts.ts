import { NumberCardChartComponent } from 'src/app/shared/charts/number-card-chart/number-card-chart.component';
import { IChart } from 'src/app/shared/interfaces';
import { ClickListComponent } from 'src/app/shared/charts/click-list/click-list.component';
import { ComboChartComponent } from 'src/app/shared/charts/combo-chart/combo-chart.component';
import { GaugeChartComponent } from 'src/app/shared/charts/gauge-chart/gauge-chart.component';
import { ILineChartData } from 'src/app/shared/charts/line-chart/line-chart-interfaces';
import { LineChartComponent } from 'src/app/shared/charts/line-chart/line-chart.component';


export let IAC_CHARTS: IChart[] = [
  
 
  
  {
    title: 'Workspace Details',
    component: LineChartComponent,
    data: [],
    yAxisLabel: 'Count->',
    xAxisLabel: 'TimeLine->',
    colorScheme: 'vivid'
  },
 {
    title: 'Meta Count',
    component: NumberCardChartComponent,
    data: [],
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: 'vivid'
  },
];

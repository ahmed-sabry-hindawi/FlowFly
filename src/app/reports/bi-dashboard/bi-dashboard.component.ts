import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as Highcharts from 'highcharts';
import * as Highcharts2 from 'highcharts';
import * as Highcharts3 from 'highcharts';
import * as Highcharts4 from 'highcharts';
import * as Highcharts_map from 'highcharts/highmaps';
import HC_more from "highcharts/highcharts-more";
import { ServiceService } from 'src/app/Services/Services.Service';
import { ServiceRequestsCountInfo } from 'src/app/models/ServiceRequestsCountInfo.model';
import * as saudiTopology from 'src/assets/MapsJson/sa-all.topo.json';
                      
HC_more(Highcharts);



@Component({
  selector: 'app-bi-dashboard',
  templateUrl: './bi-dashboard.component.html',
  // styleUrls: ['./bi-dashboard.component.css']
  styleUrls: ['../../app.component.css']
})
export class BiDashboardComponent {


  


  servicesNames: string[] = [];

  servicesRequestsCount: ServiceRequestsCountInfo[] = [];
  servicesRequestsCountArr: { name: string, y: number }[] = [];
  servicesRequestsCountWithStatusArr: { name: string, type: string, data: number[] }[] = [];
  
  constructor(
    private serviceservice: ServiceService
  ) {



  }


  ngOnInit() {

    this.loadServicesRequestsCount(); 
  }

  onTabChanged(event: MatTabChangeEvent) {


    if (event.index == 0) {
      this.DrawPieChart();

    }
    if (event.index == 1) {
      this.DrawBarChart();
    }
    if (event.index == 3) {
      this.DrawbubbleChartActive();
    }

    if(event.index==4)
    {
      this.DrawMap();
    }


  }


  loadServicesRequestsCount() {
    this.serviceservice.GetServicesRequestsCount().subscribe(res => {
      this.servicesRequestsCount = res.data;


      for (var i = 0; i < this.servicesRequestsCount.length; i++) {
        let temp: { name: string, y: number } = { name: '', y: 0 };

        temp.name = this.servicesRequestsCount[i].serviceName;
        temp.y = this.servicesRequestsCount[i].requestsCount;

        this.servicesNames.push(this.servicesRequestsCount[i].serviceName);


        this.servicesRequestsCountArr.push(temp);

      }



      let temp2: { name: string, type: string, data: [] } = { name: '', type: 'bar', data: [] };
      for (var i = 0; i < 5; i++) {

        this.servicesRequestsCountWithStatusArr.push(temp2);
      }    

      let approvedValues: number[] = [];
      let rejectedValues: number[] = [];
      let canceledValues: number[] = [];
      let completedValues: number[] = [];
      let underProcessValues: number[] = [];
      for (var j = 0; j < this.servicesRequestsCount.length; j++) {
        approvedValues.push(this.servicesRequestsCount[j].approvedRequestsCount);
        rejectedValues.push(this.servicesRequestsCount[j].rejectedRequestsCount);
        canceledValues.push(this.servicesRequestsCount[j].canceledRequestsCount);
        completedValues.push(this.servicesRequestsCount[j].closedRequestsCount);
        underProcessValues.push(this.servicesRequestsCount[j].underProcessRequestsCount);

      }

      this.servicesRequestsCountWithStatusArr[0] = { name: 'معتمد', type: 'bar', data: approvedValues };
      this.servicesRequestsCountWithStatusArr[1] = { name: 'مرفوض', type: 'bar', data: rejectedValues };
      this.servicesRequestsCountWithStatusArr[2] = { name: 'ملغى', type: 'bar', data: canceledValues };
      this.servicesRequestsCountWithStatusArr[3] = { name: 'مكتمل', type: 'bar', data: completedValues };
      this.servicesRequestsCountWithStatusArr[4] = { name: 'تحت الإجراء', type: 'bar', data: underProcessValues };


      this.DrawPieChart();


    });
  }



  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: { text: 'استخدام البوابة' },
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };



  Highcharts2Var: typeof Highcharts2 = Highcharts2;
  DrawBarChart() {
    const chart = this.Highcharts2Var.chart({

      chart: {
        type: 'bar',
        renderTo: 'containerBar',
      },
      title: {
        text: '',// 'عدد الطلبات لكل خدمة مصنفة حسب حالة الطلب',
        align: 'center'
      },
      // subtitle: {
      //   text: 'Source: <a ' +
      //     'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
      //     'target="_blank">Wikipedia.org</a>',
      //   align: 'left'
      // },
      xAxis: {
        categories: this.servicesNames,
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'عدد الطلبات',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' طلب'
      },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          dataLabels: {
            enabled: true
          },
          groupPadding: 0.1
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: 0,
        y: 400,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: this.servicesRequestsCountWithStatusArr as Highcharts.SeriesOptionsType[]

    });
  }


  Highcharts3Var: typeof Highcharts3 = Highcharts3;

  DrawPieChart() {
    const chart = this.Highcharts3Var.chart({

      chart: {
        type: 'pie',
        renderTo: 'containerPie',
      },
      title: {
        text: '',// 'نسبة الطلبات لكل خدمة'
      },
      tooltip: {
        //valueSuffix: ' طلب'
      },
      subtitle: {
        text:
          ''
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: false,

            // padding: 30,
          },

          {
            enabled: true,
            padding: 40,

            format: "%{point.name} {point.percentage:.1f}",
            style: {
              // fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }
          ]
        }
      },
      series: [{
        name: 'عدد الطلبات ',
        type: 'pie',

        colorByPoint: true,
        data: this.servicesRequestsCountArr

      }]
    });
  }


  Highcharts_mapVar: typeof Highcharts_map = Highcharts_map;
 
  //   saudiTopology = fetch(
  //   'src/assets/MapsJson/sa-all.topo.json'
  // ).then(response => response.json());


  DrawMap() {  

  
      const chart = this.Highcharts_mapVar.mapChart( {
      chart: {
        map: saudiTopology,
        borderWidth : 1,
         renderTo:'containerMap',
        
      },

      title: {
        text: 'المملكة العربية السعودية'
      },

      subtitle: {
        text: 'بيانات تجريبية'
      },

        // mapNavigation: {
        //   enabled: true,
        //   buttonOptions: {
        //     verticalAlign: 'bottom'
        //   }
        // },

      // colorAxis: {
      //   min: 1,
      //   max:30
      // },
      colorAxis: {
        min: 0,
        stops: [
            [0, '#EFEFFF'],
            [0.5, '#73A8FE'],
           
        ]
    },

      series: [{
       mapData: saudiTopology,
       
        data:[          
          ['sa-4293', 5], ['sa-tb', 11], ['sa-jz', 12], ['sa-nj', 13],
        ['sa-ri', 30], ['sa-md', 15], ['sa-ha', 16], ['sa-qs', 70],
        ['sa-hs', 18], ['sa-jf', 19], ['sa-sh', 20], ['sa-ba', 21],
        ['sa-as', 22], ['sa-mk', 23]
        ],
        type: 'map',
        name: 'Random data',
        states: {
          hover: {
            color: '#1673FD'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
    //     allAreas: true,    
    // showInLegend: true
      }]
    });

  }



  Highcharts4var: typeof Highcharts4 = Highcharts4;

  DrawbubbleChartActive() {
    const chart = this.Highcharts4var.chart({
      // Highcharts4: typeof Highcharts4 = Highcharts4;
      // chartOptions4: Highcharts.Options = {
      chart: {
        type: 'packedbubble',
        renderTo: 'containerBuble',
        height: '100%'
      },
      title: {
        text: 'نسبة انبعاثات الكربون حول العالم سنة 2014',
        align: 'left'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
      },
      plotOptions: {
        packedbubble: {
          minSize: '20%',
          maxSize: '100%',
          //zMin: 0,
          // zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      series: [{
        name: 'Europe',
        type: undefined,
        data: [{
          name: 'Germany',
          value: 767.1
        }, {
          name: 'Croatia',
          value: 20.7
        },
        {
          name: 'Belgium',
          value: 97.2
        },
        {
          name: 'Czech Republic',
          value: 111.7
        },
        {
          name: 'Netherlands',
          value: 158.1
        },
        {
          name: 'Spain',
          value: 241.6
        },
        {
          name: 'Ukraine',
          value: 249.1
        },
        {
          name: 'Poland',
          value: 298.1
        },
        {
          name: 'France',
          value: 323.7
        },
        {
          name: 'Romania',
          value: 78.3
        },
        {
          name: 'United Kingdom',
          value: 415.4
        }, {
          name: 'Turkey',
          value: 353.2
        }, {
          name: 'Italy',
          value: 337.6
        },
        {
          name: 'Greece',
          value: 71.1
        },
        {
          name: 'Austria',
          value: 69.8
        },
        {
          name: 'Belarus',
          value: 67.7
        },
        {
          name: 'Serbia',
          value: 59.3
        },
        {
          name: 'Finland',
          value: 54.8
        },
        {
          name: 'Bulgaria',
          value: 51.2
        },
        {
          name: 'Portugal',
          value: 48.3
        },
        {
          name: 'Norway',
          value: 44.4
        },
        {
          name: 'Sweden',
          value: 44.3
        },
        {
          name: 'Hungary',
          value: 43.7
        },
        {
          name: 'Switzerland',
          value: 40.2
        },
        {
          name: 'Denmark',
          value: 40
        },
        {
          name: 'Slovakia',
          value: 34.7
        },
        {
          name: 'Ireland',
          value: 34.6
        },
        {
          name: 'Croatia',
          value: 20.7
        },
        {
          name: 'Estonia',
          value: 19.4
        },
        {
          name: 'Slovenia',
          value: 16.7
        },
        {
          name: 'Lithuania',
          value: 12.3
        },
        {
          name: 'Luxembourg',
          value: 10.4
        },
        {
          name: 'Macedonia',
          value: 9.5
        },
        {
          name: 'Moldova',
          value: 7.8
        },
        {
          name: 'Latvia',
          value: 7.5
        },
        {
          name: 'Cyprus',
          value: 7.2
        }]
      }, {
        name: 'Africa',
        type: undefined,
        data: [{
          name: 'Senegal',
          value: 8.2
        },
        {
          name: 'Cameroon',
          value: 9.2
        },
        {
          name: 'Zimbabwe',
          value: 13.1
        },
        {
          name: 'Ghana',
          value: 14.1
        },
        {
          name: 'Kenya',
          value: 14.1
        },
        {
          name: 'Sudan',
          value: 17.3
        },
        {
          name: 'Tunisia',
          value: 24.3
        },
        {
          name: 'Angola',
          value: 25
        },
        {
          name: 'Libya',
          value: 50.6
        },
        {
          name: 'Ivory Coast',
          value: 7.3
        },
        {
          name: 'Morocco',
          value: 60.7
        },
        {
          name: 'Ethiopia',
          value: 8.9
        },
        {
          name: 'United Republic of Tanzania',
          value: 9.1
        },
        {
          name: 'Nigeria',
          value: 93.9
        },
        {
          name: 'South Africa',
          value: 392.7
        }, {
          name: 'Egypt',
          value: 225.1
        }, {
          name: 'Algeria',
          value: 141.5
        }]
      }, {
        name: 'Oceania',
        type: undefined,
        data: [{
          name: 'Australia',
          value: 409.4
        },
        {
          name: 'New Zealand',
          value: 34.1
        },
        {
          name: 'Papua New Guinea',
          value: 7.1
        }]
      }, {
        name: 'North America',
        type: undefined,
        data: [{
          name: 'Costa Rica',
          value: 7.6
        },
        {
          name: 'Honduras',
          value: 8.4
        },
        {
          name: 'Jamaica',
          value: 8.3
        },
        {
          name: 'Panama',
          value: 10.2
        },
        {
          name: 'Guatemala',
          value: 12
        },
        {
          name: 'Dominican Republic',
          value: 23.4
        },
        {
          name: 'Cuba',
          value: 30.2
        },
        {
          name: 'USA',
          value: 5334.5
        }, {
          name: 'Canada',
          value: 566
        }, {
          name: 'Mexico',
          value: 456.3
        }]
      }, {
        name: 'South America',
        type: undefined,
        data: [{
          name: 'El Salvador',
          value: 7.2
        },
        {
          name: 'Uruguay',
          value: 8.1
        },
        {
          name: 'Bolivia',
          value: 17.8
        },
        {
          name: 'Trinidad and Tobago',
          value: 34
        },
        {
          name: 'Ecuador',
          value: 43
        },
        {
          name: 'Chile',
          value: 78.6
        },
        {
          name: 'Peru',
          value: 52
        },
        {
          name: 'Colombia',
          value: 74.1
        },
        {
          name: 'Brazil',
          value: 501.1
        }, {
          name: 'Argentina',
          value: 199
        },
        {
          name: 'Venezuela',
          value: 195.2
        }]
      }, {
        name: 'Asia',
        type: undefined,
        data: [{
          name: 'Nepal',
          value: 6.5
        },
        {
          name: 'Georgia',
          value: 6.5
        },
        {
          name: 'Brunei Darussalam',
          value: 7.4
        },
        {
          name: 'Kyrgyzstan',
          value: 7.4
        },
        {
          name: 'Afghanistan',
          value: 7.9
        },
        {
          name: 'Myanmar',
          value: 9.1
        },
        {
          name: 'Mongolia',
          value: 14.7
        },
        {
          name: 'Sri Lanka',
          value: 16.6
        },
        {
          name: 'Bahrain',
          value: 20.5
        },
        {
          name: 'Yemen',
          value: 22.6
        },
        {
          name: 'Jordan',
          value: 22.3
        },
        {
          name: 'Lebanon',
          value: 21.1
        },
        {
          name: 'Azerbaijan',
          value: 31.7
        },
        {
          name: 'Singapore',
          value: 47.8
        },
        {
          name: 'Hong Kong',
          value: 49.9
        },
        {
          name: 'Syria',
          value: 52.7
        },
        {
          name: 'DPR Korea',
          value: 59.9
        },
        {
          name: 'Israel',
          value: 64.8
        },
        {
          name: 'Turkmenistan',
          value: 70.6
        },
        {
          name: 'Oman',
          value: 74.3
        },
        {
          name: 'Qatar',
          value: 88.8
        },
        {
          name: 'Philippines',
          value: 96.9
        },
        {
          name: 'Kuwait',
          value: 98.6
        },
        {
          name: 'Uzbekistan',
          value: 122.6
        },
        {
          name: 'Iraq',
          value: 139.9
        },
        {
          name: 'Pakistan',
          value: 158.1
        },
        {
          name: 'Vietnam',
          value: 190.2
        },
        {
          name: 'United Arab Emirates',
          value: 201.1
        },
        {
          name: 'Malaysia',
          value: 227.5
        },
        {
          name: 'Kazakhstan',
          value: 236.2
        },
        {
          name: 'Thailand',
          value: 272
        },
        {
          name: 'Taiwan',
          value: 276.7
        },
        {
          name: 'Indonesia',
          value: 453
        },
        {
          name: 'Saudi Arabia',
          value: 494.8
        },
        {
          name: 'Japan',
          value: 1278.9
        },
        {
          name: 'China',
          value: 10540.8
        },
        {
          name: 'India',
          value: 2341.9
        },
        {
          name: 'Russia',
          value: 1766.4
        },
        {
          name: 'Iran',
          value: 618.2
        },
        {
          name: 'Korea',
          value: 610.1
        }]
      }]

    });
  }


  
}




import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';

fetch('../data/world.geo.json')
  .then(res => res.json())
  .then(mapData => {
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500,
      padding: [55, 20]
    });
    chart.tooltip({
      showTitle: false,
      showMarkers: false,
      shared: true,
    });
    // 同步度量
    chart.scale({
      longitude: {
        sync: true
      },
      latitude: {
        sync: true
      }
    });
    chart.axis(false);
    chart.legend('trend', {
      position: 'left'
    });

    // 绘制世界地图背景
    const ds = new DataSet();
    const worldMap = ds.createView('back')
      .source(mapData, {
        type: 'GeoJSON'
      });
    const worldMapView = chart.createView();
    worldMapView.data(worldMap.rows);
    worldMapView.tooltip(false);
    worldMapView.polygon().position('longitude*latitude').style({
      fill: '#fff',
      stroke: '#ccc',
      lineWidth: 1
    });

    // 可视化用户数据
    const userData = [
      { name: 'Russia', value: 86.8 },
      { name: 'China', value: 106.3 },
      { name: 'Japan', value: 94.7 },
      { name: 'Mongolia', value: 98 },
      { name: 'Canada', value: 98.4 },
      { name: 'United Kingdom', value: 97.2 },
      { name: 'United States of America', value: 98.3 },
      { name: 'Brazil', value: 96.7 },
      { name: 'Argentina', value: 95.8 },
      { name: 'Algeria', value: 101.3 },
      { name: 'France', value: 94.8 },
      { name: 'Germany', value: 96.6 },
      { name: 'Ukraine', value: 86.3 },
      { name: 'Egypt', value: 102.1 },
      { name: 'South Africa', value: 101.3 },
      { name: 'India', value: 107.6 },
      { name: 'Australia', value: 99.9 },
      { name: 'Saudi Arabia', value: 130.1 },
      { name: 'Afghanistan', value: 106.5 },
      { name: 'Kazakhstan', value: 93.4 },
      { name: 'Indonesia', value: 101.4 }
    ];
    const userDv = ds.createView()
      .source(userData)
      .transform({
        geoDataView: worldMap,
        field: 'name',
        type: 'geo.region',
        as: ['longitude', 'latitude']
      })
      .transform({
        type: 'map',
        callback: obj => {
          obj.trend = (obj.value > 100) ? '男性更多' : '女性更多';
          return obj;
        }
      });
    const userView = chart.createView();
    userView.data(userDv.rows);
    userView.scale({
      trend: {
        alias: '每100位女性对应的男性数量'
      }
    });
    userView.polygon()
      .position('longitude*latitude')
      .color('trend', ['#F51D27', '#0A61D7'])
      .tooltip('name*trend')
      .style({
        fillOpacity: 0.85
      })
      .animate({
        leave: {
          animation: 'fade-out'
        }
      });
    userView.interaction('element-active');

    chart.render();
  });

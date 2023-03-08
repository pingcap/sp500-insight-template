import { MapSeriesOption, registerMap } from 'echarts';
import map from '@geo-maps/countries-land-10km/map.geo.json';

registerMap('world', map as any);

export function worldMapSeries (): MapSeriesOption {
  return {
    roam: false,
    type: 'map',
    nameProperty: 'A3',
    map: 'world',
    zoom: 1.7,
    top: '35%',
    showLegendSymbol: false,
    projection: {
      project: (point) => [point[0] / 180 * Math.PI, -Math.log(Math.tan((Math.PI / 2 + point[1] / 180 * Math.PI) / 2))],
      unproject: (point) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90],
    },
    emphasis: {
      disabled: true,
    },
    itemStyle: {
      color: '#333333',
      borderColor: '#333333',
      borderWidth: 1,
      areaColor: '#333333',
    },
    colorBy: 'data',
  };
}

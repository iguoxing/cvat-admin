<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, CanvasRenderer, LabelLayout]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

function darwChart() {
  type EChartsOption = echarts.ComposeOption<PieSeriesOption>;

  var myChart = echarts.init(chartBox.value!);
  var option: EChartsOption;

  option = {
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}

const chartBox = ref();
onMounted(() => {
  console.log('chartBox', chartBox.value);
  darwChart();
})
</script>

<template>
    <div ref="chartBox" class="chart-box"></div>
</template>

<style scoped>
.chart-box {
    width: 300px;
    height: 300px;
    background-color: #eee;
}
</style>
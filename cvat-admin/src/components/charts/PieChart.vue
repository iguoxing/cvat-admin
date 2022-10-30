<script setup lang="ts">
import { onMounted, PropType, ref, watch } from "vue";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

type EChartsOption = echarts.ComposeOption<
  |TitleComponent
  |TooltipComponentOption
  |PieSeriesOption
>;

const chartBox = ref();
echarts.use([PieChart, TitleComponent, TooltipComponent, CanvasRenderer, LabelLayout]);
const myChart = ref(null);
const props = defineProps({
  title: String,
  chartData: {
    type: Array,
    default: () => [],
    required: true,
  }
})

var option: EChartsOption;

  option = {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    title: {
      text: props.title || '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '40%',
        label: {
          normal: {
            show: true,
            formatter: '{b}:{d}%'
          }
        },
        data: props.chartData
        // [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ]
      }
    ]
  };

function darwChart() {
  myChart.value = echarts.init(chartBox.value!);

  option && myChart.value.setOption(option);
}


watch(
  () => props.chartData,
  (newVal, oldVal) => {
    console.log('watch', newVal);
    option.series[0].data = newVal;
    option && myChart.value.setOption(option);
  }
)
watch(
  () => props.title,
  (newVal, oldVal) => {
    console.log('watch', newVal);
    option.title.text = newVal;
    option && myChart.value.setOption(option);
  }
)
onMounted(() => {
  darwChart();
  // window.addEventListener('resize', resizeHandler);
})
</script>

<template>
    <div ref="chartBox" class="chart-box"></div>
</template>

<style scoped>
.chart-box {
    width: 400px;
    height: 400px;
    background-color: #eee;
}
</style>
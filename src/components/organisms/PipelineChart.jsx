import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'

export default function PipelineChart({ deals = [] }) {
  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  })

  useEffect(() => {
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
    const stageData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage)
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.amount, 0)
      }
    })

    setChartData({
      series: [{
        name: 'Deal Count',
        data: stageData.map(d => d.count)
      }, {
        name: 'Pipeline Value',
        data: stageData.map(d => d.value)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: stageData.map(d => d.stage)
        },
        yaxis: [{
          title: {
            text: 'Deal Count'
          }
        }, {
          opposite: true,
          title: {
            text: 'Pipeline Value ($)'
          },
          labels: {
            formatter: function(val) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(val)
            }
          }
        }],
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val, { seriesIndex }) {
              if (seriesIndex === 0) {
                return val + ' deals'
              } else {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                }).format(val)
              }
            }
          }
        },
        colors: ['#2563eb', '#60a5fa']
      }
    })
  }, [deals])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Sales Pipeline</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </Card>
  )
}
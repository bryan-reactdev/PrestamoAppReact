import ContentTitle from '../../components/Content/ContentTitle'
import Layout from '../../Layout'

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

export default function AdminEstadisticasDashboard(){
  const chartData = [
    { state: "Pendientes", pendientes: 3 },
    { state: "Creados", creados: 5 },
    { state: "Aceptados", aceptados: 2 },
    { state: "Rechazados", rechazados: 3 },
    { state: "Finalizados", finalizados: 1 },
  ]

  const chartData2 = [
    { month: "Enero", monto: 12 },
    { month: "Febrero", monto: 59 },
    { month: "Marzo", monto: 29 },
    { month: "Abril", monto: 39 },
    { month: "Mayo", monto: 19 },
    { month: "Junio", monto: 39 },
    { month: "Julio", monto: 59 },
    { month: "Agosto", monto: 29 },
    { month: "Septiembre", monto: 39 },
    { month: "Octubre", monto: 19 },
    { month: "Noviembre", monto: 39 },
    { month: "Diciembre", monto: 59 },
  ]

  const chartConfig = {
    monto: {
      label: "Monto",
      color: "#000000",
    },
    pendientes: {
      label: "Pendientes",
      color: "#2563eb",
    },
    creados: {
      label: "Creados",
      color: "#22c55e",
    },
    aceptados: {
      label: "Aceptados",
      color: "#2563eb",
    },
    rechazados: {
      label: "Rechazados",
      color: "#ef4444",
    },
    finalizados: {
      label: "Finalizados",
      color: "#16a34a",
    },
  }

  return(
    <Layout>
      <div className="content">
        <ContentTitle title={"Estadísticas"} />
        
        <div className='flex w-[500px] h-[300px]'>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart 
              accessibilityLayer 
              data={chartData}
              onClick={(data, index, e) => {
                console.log("Clicked data:", data);
                console.log("Data index:", index);
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey={"state"} tickLine={false} tickMargin={10} axisLine={true} />

              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar dataKey={"pendientes"} radius={1} fill="var(--color-pendientes)" barSize={200} />
              <Bar dataKey={"creados"} radius={1} fill="var(--color-creados)" barSize={200} />
              <Bar dataKey={"aceptados"} radius={1} fill="var(--color-aceptados)" barSize={200} />
              <Bar dataKey={"rechazados"} radius={1} fill="var(--color-rechazados)" barSize={200} />
              <Bar dataKey={"finalizados"} radius={1} fill="var(--color-finalizados)" barSize={200} />
            </BarChart>
          </ChartContainer>

          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart 
              accessibilityLayer 
              data={chartData2}
              onClick={(data, index, e) => {
                console.log("Clicked data:", data);
                console.log("Data index:", index);
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey={"month"} tickLine={false} tickMargin={10} axisLine={true} />

              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Line dataKey={"monto"} radius={1} stroke="var(--color-monto)" strokeWidth={4} fill="var(--color-monto)" barSize={200} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </Layout>
  )
}
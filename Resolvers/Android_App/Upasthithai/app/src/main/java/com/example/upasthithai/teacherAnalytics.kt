//package com.example.upasthithai
//
//import android.graphics.Color
//import android.os.Bundle
//import android.widget.LinearLayout
//import android.widget.TextView
//import androidx.appcompat.app.AppCompatActivity
//import com.jjoe64.graphview.GraphView
//import com.jjoe64.graphview.series.BarGraphSeries
//import com.jjoe64.graphview.series.DataPoint
//import com.jjoe64.graphview.series.LineGraphSeries
//
//class teacherAnalytics : AppCompatActivity() {
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.teacheranalytics)
//
//        // Hardcoded analytics
//        val presentCount = 25
//        val absentCount = 5
//        val percentAttendance = 83
//
//        findViewById<TextView>(R.id.tvPresent).text = presentCount.toString()
//        findViewById<TextView>(R.id.tvAbsent).text = absentCount.toString()
//        findViewById<TextView>(R.id.tvAttendancePercent).text = "$percentAttendance%"
//
//        // Weekly Attendance (Line Chart)
//        val weeklyGraph = GraphView(this)
//        findViewById<LinearLayout>(R.id.weeklyChartContainer).addView(weeklyGraph)
//        val lineSeries = LineGraphSeries(arrayOf(
//            DataPoint(1.0, 20.0),
//            DataPoint(2.0, 22.0),
//            DataPoint(3.0, 25.0),
//            DataPoint(4.0, 24.0),
//            DataPoint(5.0, 27.0)
//        ))
//        lineSeries.color = Color.BLUE
//        weeklyGraph.addSeries(lineSeries)
//
//        // Monthly Attendance (Bar Chart)
//        val monthlyGraph = GraphView(this)
//        findViewById<LinearLayout>(R.id.monthlyChartContainer).addView(monthlyGraph)
//        val barSeries = BarGraphSeries(arrayOf(
//            DataPoint(1.0, 80.0),
//            DataPoint(2.0, 85.0),
//            DataPoint(3.0, 75.0),
//            DataPoint(4.0, 90.0)
//        ))
//        barSeries.color = Color.GREEN
//        monthlyGraph.addSeries(barSeries)
//    }
//}

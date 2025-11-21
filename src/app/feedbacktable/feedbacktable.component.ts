import { Component, ViewChild } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { firebasefeedbackdata } from '../environment';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-feedbacktable',
  templateUrl: './feedbacktable.component.html',
  styleUrls: ['./feedbacktable.component.css']
})
export class FeedbacktableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ratingTrendChart: any;
  feedbackCountChart: any;
  flavourPieChart: any;
  averageRating: number = 0;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  dataSource = new MatTableDataSource<firebasefeedbackdata>([]);


  displayedColumns = ['feedback', 'flavour', 'menu', 'rating','date'];
  constructor(private firestore:FirebaseService){
    firestore.getFeedbacks().then(data => {
      console.log('data',data)
      this.dataSource.data = data
      this.dataSource.data = this.dataSource.data.map(r => ({
        ...r,
        expanded: false
      }));
      setTimeout(() => {
        this.generateAnalytics();
      }, 200);
    })
  }

  toggleRow(row: any) {
    row.expanded = !row.expanded;
  }
  
  generateAnalytics() {
  let data = [...this.dataSource.data];

  // ------------------ 1) SORT BY DATE ------------------
  data.sort((a: any, b: any) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Extract ratings + dates
  const ratings = data.map((x: any) => x.rating);
  const dates = data.map((x: any) =>
    new Date(x.date).toLocaleDateString()
  );

  // ------------------ 2) AVERAGE RATING ------------------
  this.averageRating = Number(
    (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
  );

  // ------------------ 3) RATING TREND CHART ------------------
  if (this.ratingTrendChart) this.ratingTrendChart.destroy();
  this.ratingTrendChart = new Chart("ratingTrendChart", {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Rating Trend",
          data: ratings,
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    },
    options: { responsive: true }
  });

  // ------------------ 4) FEEDBACK COUNT ------------------
  const feedbackCount: any = {};

  data.forEach((item: any) => {
    const d = new Date(item.date).toLocaleDateString();
    feedbackCount[d] = (feedbackCount[d] || 0) + 1;
  });

  const sortedFeedbackDates = Object.keys(feedbackCount).sort(
    (a: any, b: any) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (this.feedbackCountChart) this.feedbackCountChart.destroy();
  this.feedbackCountChart = new Chart("feedbackCountChart", {
    type: "bar",
    data: {
      labels: sortedFeedbackDates,
      datasets: [
        {
          label: "Feedbacks",
          data: sortedFeedbackDates.map(d => feedbackCount[d]),
          borderWidth: 1
        }
      ]
    },
    options: { responsive: true }
  });

  // ----------------------------------------------------------
  // 5️⃣ FLAVOUR DISTRIBUTION: (MENU + FLAVOUR) COMBINATION
  // ----------------------------------------------------------
  const menuFlavourCounts: any = {};

  data.forEach((x: any) => {
    const key = `${x.menu} - ${x.flavour}`;
    menuFlavourCounts[key] = (menuFlavourCounts[key] || 0) + 1;
  });

  if (this.flavourPieChart) this.flavourPieChart.destroy();
  this.flavourPieChart = new Chart("flavourPieChart", {
    type: "pie",
    data: {
      labels: Object.keys(menuFlavourCounts),
      datasets: [
        {
          data: Object.values(menuFlavourCounts)
        }
      ]
    },
    options: { responsive: true }
  });
  }


}

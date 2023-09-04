const csvUrl = "../assets/data/modifiedData.csv";

function parse_data(data) {
  let date_time_format_options = {
    month: "long",
  };
  data.budget = +data.budget;
  data.revenue = +data.revenue;
  data.profit = data.revenue - data.budget;
  data.release_date = new Date(data.release_date);
  data.year = data.release_date.getFullYear();
  data.month = data.release_date.getMonth();
  data.month = Intl.DateTimeFormat("en-US", date_time_format_options).format(
    data.release_date
  );

  return data;
}

const {
  csv,
  flatGroup,
  flatGroups,
  flatRollup,
  extent,
  mean,
  sum,
  group,
  rollup,
} = d3;

const main = async () => {
  let raw_data;
  try {
    raw_data = await csv(csvUrl, parse_data);
  } catch (error) {
    console.log(error);
  }
  // console.log(raw_data);

  let a = flatRollup(
    raw_data,
    (v) => sum(v, (d) => d.profit),
    (d) => d.year
  );

  a = a.sort();

  var options = {
    series: [{ name: "Aggregated Profit for year", data: a.map((d) => d[1]) }],
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        offsetY: -20,
      },
    },
    stroke: {
      curve: "stepline",
    },
    colors: ["#000000"],
    xaxis: {
      categories: a.map((d) => d[0]),
      offsetY: 20,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          // turns 3,000,000,000 into 3B for Billion
          value = Intl.NumberFormat("en", { notation: "compact" }).format(
            value
          );
          return `$ ${value}`;
        },
        maxWidth: 300,
        offsetX: -15,
      },
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
};

main();

debugger;
const increments = Array.from(d3.range(1800, 2010, 1));
const svg = d3.select(container).append("svg").attr("viewBox", [0, 0, 600, 280]); 
const year = 1800;//Scrubber(d3.range(1800, 2010, 0.1), {format: Math.floor, loop: false});
const height = 280;
const width = 540;
const bisectYear = d3.bisector(([year]) => year).left;
const margin = ({top: 20, right: 20, bottom: 35, left: 40});
const data2 = [];
const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80, ","))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("Income per capita (dollars) →"));
const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Life expectancy (years)"));

const x = d3.scaleLog([200, 1e5], [margin.left, width - margin.right]);
const y = d3.scaleLinear([14, 86], [height - margin.bottom, margin.top]);
const radius = d3.scaleSqrt([0, 5e8], [0, width / 24]);

const grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom +500))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right));

svg.append("g").call(xAxis);
svg.append("g").call(yAxis);
svg.append("g").call(grid);

function resizeWindow(){
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false,window,0);
    window.dispatchEvent(evt); 
}

async function getOurData(){
	return d3.json("http://ppmdemo:8084/itg/web/knta/test/data/nations.json");
}
  
 


async function doTheWork(val)
{
  //await getOurData().then((data2) => {data = data2})
//const doSomething = async () => {

  const color = d3.scaleOrdinal(data.map(d => d.region), d3.schemeCategory10).unknown("black");  
  //const sleep = (milliseconds) => { 
  //d3.select(container).select("svg").select("g").selectAll("circle").join("circle").remove();
  d3.select(container).select("svg").selectAll("circle").remove();
  const circle = d3.select(container).select("svg").append("g")
    .attr("stroke", "black")
    .selectAll("circle")
    .data(dataAt(val), d => d.name)
    .join("circle")
      .sort((a, b) => d3.descending(a.population, b.population))
      .attr("cx", d => x(d.income))
      .attr("cy", d => y(d.lifeExpectancy))
      .attr("r", d => radius(d.population))
      .attr("fill", d => color(d.region))
      .call(circle => circle.append("title")
        .text(d => [d.name, d.region].join("\n")));
  const setYearforVis = d3.select(changl)
                      .call(setYearforVis =>setYearforVis.text(val))
                      .call(setYearforVis =>setYearforVis.value=val);
  //here
Object.assign(svg.node(), {
    update(data) {
      circle.data(data, d => d.name)
          .sort((a, b) => d3.descending(a.population, b.population))
          .attr("cx", d => x(d.income))
          .attr("cy", d => y(d.lifeExpectancy))
          .attr("r", d => radius(d.population));
    }
  });
  //sleep(1200);

  

//doSomething();
//currentData = dataAt(1800);
//chart.update(currentData);


function dataAt(year) {
  return data.map(d => ({
    name: d.name,
    region: d.region,
    income: valueAt(d.income, year),
    population: valueAt(d.population, year),
    lifeExpectancy: valueAt(d.lifeExpectancy, year)
  }));
}


function valueAt(values, year) {
  const i = bisectYear(values, year, 0, values.length - 1);
  const a = values[i];
  if (i > 0) {
    const b = values[i - 1];
    const t = (year - a[0]) / (b[0] - a[0]);
    return a[1] * (1 - t) + b[1] * t;
  }
  return a[1];
}
  //await sleep(2000);
  
} //Close do the work

function disposal(element) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const target = element.closest(".observablehq");
      if (!target) return resolve();
      const observer = new MutationObserver(mutations => {
        if (target.contains(element)) return;
        observer.disconnect(), resolve();
      });
      observer.observe(target, {childList: true});
    });
  });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



var promise3 = new Promise(async function (resolve, reject) {
            await getOurData().then((data2) => {
              console.log(data2);
              data = data2;
            increments.forEach(function(val)
             {
              //d3.select("svg").remove();
			   
              //doTheWork(val)

            });
            
            })         
        });

var i=1;
var intrv=2; // << control this variable
var incs = 0;
var refreshId = setInterval(function() {
  if(!(i%intrv)) {
    //alert('run!');
    if (increments.length > incs)
    {
    	doTheWork(increments[incs]);
        incs++;
    }
    else
    {
      intrv = 1;
    }
  }
  i++;
}, 50);
let width = 1500;
let height = 1000;
let radius = width / 2;

let rootPortfolios = [];

let allPortfolios = [];

let portfolios = {};

let pfmEntities = [];

debugger;

data.forEach(function(d) {
    var entityId = d[0];
  var name = d[1];
  var parentPortfolioId = d[2];
  var entityType = d[3];

  var node = {"name": name, "value": entityId, "parentPortfolioId" : parentPortfolioId, "children": []};

  if ("PORTFOLIO" === entityType) {
    portfolios['' + entityId] = node;
    allPortfolios.push(node);
  node.isPortfolio = true;

    if (parentPortfolioId === null || parentPortfolioId === "" || parentPortfolioId === " " ) {
      rootPortfolios.push(node);
    }

  } else {
 node.isPortfolio = false;
    pfmEntities.push(node);
  }
});

  
  // Now filling entities in porfolios
pfmEntities.forEach(function (pfmEntity) {
  
  //Only organize Portfolios identified.
  if (typeof portfolios[''+pfmEntity['parentPortfolioId']] !== 'undefined') {
  portfolios[''+pfmEntity['parentPortfolioId']].children.push(pfmEntity);
  }
  
});

// Building portfolio Hierarchy

var currentPortfolios = rootPortfolios;

while (currentPortfolios.length > 0) {
  var nextPortfolios = [];
  currentPortfolios.forEach(function (currentPf) {
    var pfmId = currentPf.value;

    allPortfolios.forEach(function (pf) {
      if (pf.parentPortfolioId == pfmId) {
        currentPf['children'].push(pf);
        nextPortfolios.push(pf);
      }
    });
  });
  currentPortfolios = nextPortfolios;
}

let graphData = {
  "name": "root",
  "children": rootPortfolios
}

console.log(graphData);

let tree = graphData => d3.tree()
  .size([2 * Math.PI, radius])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
  (d3.hierarchy(graphData));

let autoBox = function autoBox() {
  const {x, y, width, height} = this.getBBox();
  return [x, y, width, height];
}

const root = tree(graphData);

const svg = d3.select(container).append("svg")
  .style("max-width", "100%")
  .style("height", height)
  .style("width", width)
  .style("font", "10px sans-serif")
  .style("margin", "5px");

const link = svg.append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
  .selectAll("path")
  .data(root.links())
  .join("path")
  .attr("d", d3.linkRadial()
    .angle(d => d.x)
    .radius(d => d.y));

const node = svg.append("g")
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
  .selectAll("g")
  .data(root.descendants().reverse())
  .join("g")
  .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

node.append("circle")
  .attr("fill", d => d.children ? "#555" : "#999")
  .attr("r", 2.5);

node.append("text")
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
  .text(d => d.data.name)
  .attr("font-weight", d => (d.data.isPortfolio ? "bold" : "normal"))
  .attr("font-style", d => (d.data.isPortfolio ? "italic" : "normal"))
  .clone(true).lower()
  .attr("stroke", "white");

//yield svg.node();

svg.attr("viewBox", autoBox);

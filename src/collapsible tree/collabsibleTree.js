let width = 1500;
let radius = width / 2;
let dx = 10;
let dy = width / 6;
let margin = ({top: 10, right: 120, bottom: 10, left: 40});
let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
//let tree = d3.tree().nodeSize([dx, dy]);

debugger;

let rootPortfolios = [];

let rootPrograms = [];

let allPortfolios = [];

let allPrograms = [];

let portfolios = {};

let programs = {};

let pfmEntities = [];

debugger;

data.forEach(function(d) {
  var entityId = d[0];
  var name = d[1];
  var parentPortfolioId = d[2];
  var entityType = d[3];
  var parentType = d[4];
  
  //Each record is reprented by the following fields
  var node = {"name": name, "value": entityId, "parentPortfolioId" : parentPortfolioId, "children": [], "entityType": entityType, "parentType": parentType};

  //If the record is a portfolio
  if ("PORTFOLIO" === entityType ) {
    portfolios['' + entityId] = node;
    allPortfolios.push(node);
    node.isPortfolio = true;

    if (parentPortfolioId === null || parentPortfolioId === "" || parentPortfolioId === " " ) {
      rootPortfolios.push(node);
    }

  } 
  //If the record is a Program
  else if ("PROGRAM" === entityType)
  {
     programs['' + entityId] = node;
     allPrograms.push(node);
     node.isPortfolio = true;
    //If the record is a stand-alone (root) Program
     if (parentPortfolioId === null || parentPortfolioId === "" || parentPortfolioId === " " ) {
        rootPrograms.push(node);
    }
  }
  //If the record is not a Program or Portfolio.
  else {
    node.isPortfolio = false;
    pfmEntities.push(node);
  }
});

// Now filling entities in porfolios
pfmEntities.forEach(function (pfmEntity) {
  if ("PORTFOLIO" === pfmEntity.parentType) {
  	portfolios[''+pfmEntity['parentPortfolioId']].children.push(pfmEntity);
  }
   if ("PROGRAM" === pfmEntity.parentType) {
  	programs[''+pfmEntity['parentPortfolioId']].children.push(pfmEntity);
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
    
     allPrograms.forEach(function (pro) {
      if (pro.parentPortfolioId == pfmId) {
          currentPf['children'].push(pro);
          nextPortfolios.push(pro);
      }
    });
    
  });
  currentPortfolios = nextPortfolios;
}

if (rootPrograms.length > 0) {
	rootPrograms.forEach(function (currentPro) {
      rootPortfolios.push(currentPro);
});

}

let graphData = {
  "name": "Inc.",
  "children": rootPortfolios
}

console.log(graphData);

let tree = d3.tree().nodeSize([dx, dy]);

//tree = graphData => d3.tree()
//  .size([2 * Math.PI, radius])
//  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
//  (d3.hierarchy(graphData));
const root = d3.hierarchy(graphData);
tree(root);
//const root = tree(graphData);

root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  
  
  const svg = d3.select(container).append("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

   const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);
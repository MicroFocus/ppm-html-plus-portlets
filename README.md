# ppm-html-plus-portlets
Public Github Repo hosting Micro Focus PPM Guide and Sample code for HTML+ portlets
Portlets for use with Microfocus PPM.  The base code used to build these examples can be found https://observablehq.com/@d3/gallery.

<img src="https://github.com/MicroFocus/ppm-html-plus-portlets/raw/master/htmlplus.PNG">

etienne.canaud@microfocus.com
christopher.hangl@microfocus.com


<b>Development mode vs. Production mode</b>
PPM starts by default in Production mode.  When the server is in PRODUCTION mode, HTML+ portlet definitions are in read-only, so you can only import portlet definitions using kMigratorImport.sh, not edit portlet definition.  If you develop HTML + Portlets you will need to do it in a development instance.  Please see the following instructions:

<a href="https://admhelp.microfocus.com/ppm/en/9.50-9.55/Help/Content/SA/InstallAdmin/enable-development-mode.htm?Highlight=Development mode">enable-development-mode</a>

or Windows: com.kintana.core.server.JVM_OPTIONS=-Dserver.mode=DEVELOPMENT

<b>Admin Console’s Feature Toggles for HTML+</b>
To use the HTML+ Portlets you must have the feature toggle on.  Moreover, to use multiple Dashboard Datasources in HTML+ Portlets you must have it on.
 
<b>Download D3js</b>
<a href="https://d3js.org/">d3js</a>
 Place on the server in for example 
/itg/web/knta/test/js/lib/d3.js

For d3.js, you might mention the version numbers are important. Current major version is v5 – but you can still find lots of example online that are built against earlier versions, such as v3. There are changes in APIs which means examples will likely need some changes before it works – so you should watch out for d3 version if you use some existing code.

<b>Example Visualizations</b>
We used many observable examples and converted them to function in PPM.  We cannot run Observable runtime, in PPM or utilize any of their worksheet implementations.
https://observablehq.com/@d3/gallery

<b>PPM Interactive REST API Help</b>
The below link shows the url to access the various API and results.
https://admhelp.microfocus.com/ppm/en/9.50-9.55/Help/Content/RG/WebSvcsREST/Interactive-API-Help.htm?Highlight=Rest

<b>How to attach to container and SVG</b>

code like the below :
const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);
	whould translate to :
const svg = d3.select(container).append("svg")
.attr("viewBox", [0, 0, width, height]);	


Basically, we select the container and insert there.  This JavaScript code will be inserted as the body of a function that will receive the following parameters:

container: The root <div> element of the portlet when the CSS, HTML and JavaScript code will be inserted



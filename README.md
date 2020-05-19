# ppm-html-plus-portlets
Public Github Repo hosting Micro Focus PPM Guide and Sample code for HTML+ portlets
Portlets for use with Microfocus PPM.  The base code used to build these examples can be found https://observablehq.com/@d3/gallery.
etienne.canaud@microfocus.com
christopher.hangl@microfocus.com


<b>Development mode vs. Production mode</b>
PPM starts by default in Production mode.  When the server is in PRODUCTION mode, HTML+ portlet definitions are in read-only, so you can only import portlet definitions using kMigratorImport.sh, not edit portlet definition.  If you develop HTML + Portlets you will need to do it in a development instance.  Please see the following instructions:

<a href="https://admhelp.microfocus.com/ppm/en/9.50-9.55/Help/Content/SA/InstallAdmin/enable-development-mode.htm?Highlight=Development mode">enable-development-mode</a>

or Windows: com.kintana.core.server.JVM_OPTIONS=-Dserver.mode=DEVELOPMENT

<b>Admin Console’s Feature Toggles for HTML+</b>
To use the HTML+ Portlets you must have the feature toggle on.  Moreover, to use multiple Dashboard Datasources in HTML+ Portlets you must have it on.
 

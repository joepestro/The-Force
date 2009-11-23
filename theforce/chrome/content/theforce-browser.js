/* 
The Force by Joe Pestro
Use the force, Luke!

										 .___________. __    __   _______ 
                     |           ||  |  |  | |   ____|
                     `---|  |----`|  |__|  | |  |__   
                         |  |     |   __   | |   __|  
                         |  |     |  |  |  | |  |____ 
                         |__|     |__|  |__| |_______|

             _______   ______   .______        ______  _______ 
            |   ____| /  __  \  |   _  \      /      ||   ____|
            |  |__   |  |  |  | |  |_)  |    |  ,----'|  |__   
            |   __|  |  |  |  | |      /     |  |     |   __|  
            |  |     |  `--'  | |  |\  \----.|  `----.|  |____ 
            |__|      \______/  | _| `._____| \______||_______|

*/

/*
 *
 * Avoid conflicts with external javascript variables, etc. by packaging all of the
 * variables this plugin uses in a special object. This requires a novel way to 
 * initialized variables and functions which may not be familiar to everyone.
 *
 */
var theforce = {

    /* 
     *
     * Toggle Function
     *
     * This is our main function. Scroll down and edit the part of this function that screams
     * for you to edit it. This is the javascript that will be executed whenever someone activates 
     * your plugin.
     *
     */
    toggle: function() {

        try {

          try {

            /* We test to see if our CSS has already been injected into the browser page by
             * testing for the existence of an empty DIV tag we insert into the HTML. If this
             * DIV tag exists, we know the page supports all of the necessary elements for
             * operating the plugin. If it does not, we simply add them below. If you need to
             * add DIV tags or page elements, I recommend doing it below.
             */
            theforce.statusWindow = content.document.getElementById("theforce-status");

            if (!theforce.statusWindow) {

              // Add Packaged CSS (theforce/chrome/skin/classic/theforce.css)
              var theforceCss = content.document.createElementNS("http://www.w3.org/1999/xhtml", "link");
              theforceCss.setAttribute("rel", "stylesheet");
              theforceCss.setAttribute("type", "text/css");
              theforceCss.setAttribute("href", "chrome://theforce/skin/theforce.css");
              content.document.getElementsByTagName("head")[0].appendChild(theforceCss);

              // Status Window
              theforce.statusWindow = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
              theforce.statusWindow.setAttribute("id", "theforce-status");
              content.document.documentElement.appendChild(theforce.statusWindow);

            }

          } catch (err) {}

          try {
								// get current url
								var urlbar = document.getElementById('urlbar');
								
								// get project path
								var prefManager = Components.classes["@mozilla.org/preferences-service;1"].
																	getService(Components.interfaces.nsIPrefBranch);
								var projectPath = prefManager.getCharPref("extensions.theforce.projectPath");
								
								if (urlbar && urlbar.value.indexOf("http://localhost") == 0 && projectPath) {
										// get directory where we are
										// the extension's id from install.rdf
										var MY_ID = "theforce@joe.pestro";
										var em = Components.classes["@mozilla.org/extensions/manager;1"].
										         getService(Components.interfaces.nsIExtensionManager);
										// the path may use forward slash ("/") as the delimiter
										// returns nsIFile for the extension's install.rdf
										var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, "theforce.rb");
										var filestring = file.path.replace(/ /g, "\ ");	// replace spaces in path. grr
									
										// get path part of this url
										var url = urlbar.value.substring(urlbar.value.indexOf("/", 7));
										if (url.indexOf("?") != -1)
											url = url.substring(0, url.indexOf("?"));
										if (url.indexOf("#") != -1)
											url = url.substring(0, url.indexOf("#"));
									
										// create an nsILocalFile for the executable
										var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
										file.initWithPath("/usr/bin/ruby");

										// create an nsIProcess
										var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
										process.init(file);

										// Run the process.
										// If first param is true, calling thread will be blocked until
										// called process terminates.
										// Second and third params are used to pass command-line arguments
										// to the process.
										if (content.document.getSelection())
												var args = [filestring, url, projectPath, content.document.getSelection()];
										else
												var args = [filestring, url, projectPath];
							
										process.run(false, args, args.length);
								}
								else if (!projectPath) {
										alert("Specify project path in about:config, you must.")
								}
								else {
										alert("Use The Force from localhost, you must.")
								}

          } catch (err) { alert(err.message); }

        } catch (err) {}

    },

    /* Variables */

    statusWindow: "",

    /* Functions */

    /* Initialization Function -- invoked at the bottom of this file, it
     * instructs the browser to run the onPageLoad function when the browser
     * starts up.
     */
    init: function() {
      window.addEventListener('load', this.onPageLoad, false);
    },

    /*
     *
     * PageLoad Function - we add our general event listeners here. The most 
     * useful is listening for onTabSelect so that we can "retoggle" the plugin
     * so that it remains in use each time the user switches tabs.
     *
     */
    onPageLoad: function(evt) { theforce._onPageLoad(); },
    _onPageLoad: function(evt) {
        try {
          // Add onTabSelect Listener
          gBrowser.mTabContainer.addEventListener('select', this.onTabSelect, false);
        } catch (err) {}
    },

    /*
     *
     * TabSelect Function - if you wish to start the plugin automatically every
     * time the users switches to a new tab, add the necessary code below.
     *
     */
    onTabSelect: function(evt) { theforce._onTabSelect(); },
    _onTabSelect: function(evt) {
        try {
	  // theforce.toggle(); // uncomment to initialize the plugin each time a user switches to a new window
        } catch (err) {}
    },

    /* Empty Closing Function
     *
     * In this type of data structure all of our functions save the very last one need to be followed by a comma. 
     * Including this empty function at the end is a useful way to avoid problems. You can get rid of this if you 
     * know what you are doing.
     *
     */
    all_other_functions_need_to_close_with_comma: function() {}

};

theforce.init();

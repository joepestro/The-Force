The Force
=========

The Force is an experimental Firefox extension that binds your Rails project to Firefox. 

This allows you to "Use The Force" from any page and open the responsible file(s) in your text editor. Hate digging through controllers, views, and partials to find the content you're looking for? I do. But with this extension, you don't have to. It adds a context menu (right click) item and Tools menu item that are aware of the current page and selected text (if present). The Force will scan your render chain and open the appropriate file(s) automatically. If text is selected, will jump you to the line where that text is found.

Installation
------------

You can install the pre-compiled theforce.xpi by dragging it into Firefox. Type *about:config* in the address bar and search for the property *extensions.theforce.projectPath*. Change the value to the root path of your desired Rails project.

Usage Basics
------------

Navigate to http://localhost:3000/ and right click (or use the Tools menu), and select "Use The Force".

Compiling
---------

To build from source, run the compile script:

    ./compile

This will build a new theforce.xpi file which should then be reinstalled in Firefox. The extension hands off control between a few files:

* `theforce-browser.js`: acts as a launcher for the extension, gathers information from the current page and passes it to ruby for inspection. 
* `theforce.rb`: all functionality for loading the Rails environment and scanning rendered files happens here.
* `preferences.js`: stores the extension variable which contains the path to the current Rails project directory.

How it works
------------

The Force analyzes the most recent entries in your development Rails log to determine which files are responsible for the last page render. Uses `sed` to find the line of selected text, and passes this to the `mate` command to open the correct file and jump to the line where the text is located. Because of this, The Force works best when larger amounts of text are selected (to prevent duplicate matches), and the text should be present in the source code.

Current Limitations
-------------------

* TextMate-only right now
* Relies on default controller naming conventions 

Copyright
---------

**The Force** is Copyright (c) [Joe Pestro](http://joepestro.github.com), released under the MIT License.

The **Generic Firefox Plugin** is Copyright (c) [David Lancashire](http://popupchinese.com)

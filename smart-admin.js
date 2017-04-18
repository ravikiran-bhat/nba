======================================================
	Steps to integrate Smart Admin template 
======================================================

1. Copy "HTML_version" folder to "app/core" directory.
2. Rename "HTML_version" folder to "smart-admin".
3. Include required css and markup in index.html.
4. Include "app/core/smart-admin/js/app.min.js" and "app/core/smart-admin/js/app.config.js" in the project.

==============================
   app.min.js file changes
==============================

1. Replace $.root_ with $('body').

2. Find 'effect' and remove the line ",a.effect(...".

3. Find $(document).ready(). Remove all the functions inside the doc.ready function. 
   - initApp.SmartActions();
   - initApp.domReadyMisc();
   - initApp.leftNav();

4. Also remove these functions which are just before doc.ready.
   - initApp.addDeviceType();
   - initApp.menuPos();

5. Call all the above functions when the "Smart Admin" dashboard DOM is loaded.
//view example on codepen

// var WAFFLE_ADDRESS = 'http://static.gapminderdev.org/vizabi/waffles/en/basic-indicators.csv';

var WAFFLE_ADDRESS = 'http://localhost/projects/vizabi-docs/bower_components/vizabi/local_data/waffles/en/basic-indicators.csv';

var CODEPEN_WAFFLE_ADDRESS = "https://dl.dropboxusercontent.com/u/4933279/Gapminder/waffles/en/basic-indicators.csv";

function viewOnCodepen(TITLE, JS, HTML, CSS) {

	var BASE_URL = "http://static.gapminderdev.org/vizabi/develop/dist/";

	var HTML = HTML || "<h1>Vizabi Example: "+TITLE+"</h1><div id='placeholder'></div>";

	var CSS = CSS || "body{font-family:Arial,sans-serif;text-align:center;background:#ffffff}h1{color:#ccc}#placeholder{position:relative;display:block;margin:0 auto;width:600px;height:400px;border:1px solid #ccc}";

	var data = {
		title: "VIZABI EXAMPLE - "+TITLE,
		html: HTML,
		css: CSS,
		js: JS,
		js_external: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js;"+BASE_URL+"vizabi.min.js",
		css_external: BASE_URL+"vizabi.css"
	};

	var JSONstring = JSON.stringify(data).replace(/"/g, "&​quot;").replace(/'/g, "&apos;");

	var form = document.createElement('FORM');
	form.name='CodepenForm';
	form.id='CodepenForm';
	form.method='POST';
	form.action='http://codepen.io/pen/define';
	form.target='_blank';

	field=document.createElement('INPUT');
	field.type='HIDDEN';
	field.name='data';
	field.value=JSONstring;
	form.appendChild(field);
	document.body.appendChild(form);
	form.submit();
	document.getElementById("CodepenForm").remove();

}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
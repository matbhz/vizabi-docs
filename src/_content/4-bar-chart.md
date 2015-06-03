---
title: Bar Chart
slug: bar-chart
---

##Embedding

Similarly, you can also embed our bar chart.

<div id="bar-chart-placeholder" class="vizabi-placeholder no-border"></div>

In the following example, Vizabi **BarChart** will appear in the div `placeholder`

<a onclick='openBarChartExample()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BarChart', document.getElementById('placeholder'));
```

##Customization

The same customization options (color, entities, indicator, language) also work. [Learn more about all available options here](https://github.com/Gapminder/vizabi/blob/develop/src/tools/barchart/barchart-tool.js#L45).

<a onclick='openBarChartExample2()' class="button"><i class='fa fa-codepen'></i> Check out the example on Codepen</a>

<script>

function openBarChartExample() {
	viewOnCodepen("Bar Chart", "var viz = Vizabi('BarChart', document.getElementById('placeholder'), { data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function openBarChartExample2() {
	viewOnCodepen("Bar Chart", "var viz = Vizabi('BarChart', document.getElementById('placeholder'), { data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' },state:{entities:{show:{filter:{'geo':['fin','nor','swe'],'geo.cat':['country']}}},marker:{color:{'use':'indicator','which':'pop',},axis_y:{'use':'indicator','which':'pop'}}}});");
}

ready(function() {

	Vizabi('BarChart', document.getElementById('bar-chart-placeholder'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			}
		}
	);

});
</script>
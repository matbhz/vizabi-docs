---
title: Line Chart
slug: line-chart
---

##Embedding

Similarly, you can also embed our line chart.

<div id="line-chart-placeholder" class="vizabi-placeholder no-border"></div>

In the following example, Vizabi **LineChart** will appear in the div `placeholder`

<a onclick='openLineChartExample()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('LineChart', document.getElementById('placeholder'));
```

##Customization

The same customization options (color, entities, indicator, language) also work. [Learn more about all available options here](https://github.com/Gapminder/vizabi/blob/develop/src/tools/linechart/linechart-tool.js#L45).

<script>

function openLineChartExample() {
	viewOnCodepen("Line Chart", "var viz = Vizabi('LineChart', document.getElementById('placeholder'), { data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}


ready(function() {

	Vizabi('LineChart', document.getElementById('line-chart-placeholder'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			}
		}
	);

});
</script>
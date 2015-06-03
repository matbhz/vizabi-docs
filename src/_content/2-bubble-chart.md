---
title: Bubble Chart
slug: bubble-chart
---

##Embedding

You can embed a Vizabi tool on your page or blog and tell your story with our graph:

<div id="bubble-chart-placeholder" class="vizabi-placeholder no-border"></div>

In the following example, Vizabi **BubbleChart** will appear in the div `placeholder`

<a onclick='openBubbleChartExample()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```html
<link rel="stylesheet" type="text/css" href="path/to/vizabi.css">
<script src="path/to/vizabi.js"></script>
<div id='placeholder' width="600px" height="400px"></div>
<script>
	var viz = Vizabi('BubbleChart', document.getElementById('placeholder'));
</script>
```


##Responsiveness

You can also embed the chart in a placeholder with flexible width. Resize the browser window to see the effect on the previous chart or <a onclick='openBubbleChartExample2()'>view the example on Codepen</a>. Styling and layouting of the bubble chart tool will change.

<a onclick='openBubbleChartExample2()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>
```html
<div id='placeholder' style='position: absolute; top: 0;
bottom: 0; left: 0; right: 0;'></div>
```

If on a mobile, just flip your device. <button class="button right" onclick="flipDeviceBubbleChart()"><i class="fa fa-repeat"></i> Flip Device</button>

<div id="bubble-chart-placeholder2" class="vizabi-placeholder mobile landscape"></div>



##Colors

Vizabi tools are crafted to be highly customisable. You can enable or disable features and do all sorts of tuning. **Let's hack the color of regions.**

<div id="bubble-chart-placeholder3" class="vizabi-placeholder no-border"></div>

Vizabi Initialization:

<a onclick='openBubbleChartExample3()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BubbleChart', document.getElementById('placeholder'), { 
	state: {
	    "marker": {
	        "color": {
	            "palette": {
	                "asi": "teal",
	                "ame": "limegreen",
	                "eur": "red",
	                "afr": "deepskyblue"
	            }
	        }
	    }
	}
});
```

This state &#8594; marker &#8594; color &#8594; palette sequence is rather obscure. Read the [bubble chart default state here](https://github.com/Gapminder/vizabi/blob/develop/src/tools/bubblechart/bubblechart-tool.js#L46) to see what is possible to change.

##Indicators

One strong side of Vizabi framework is that you can change the displayed indicators as easily as you change colors. Let's set X axis to show population and color to show life expectancy:

<div id="bubble-chart-placeholder4" class="vizabi-placeholder no-border"></div>

<a onclick='openBubbleChartExample4()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BubbleChart', document.getElementById('placeholder'), { 
	state: {
        "marker": {
            "color": {
                "use": "indicator",
                "which": "lex"
            },
            "axis_x": {
                "use": "indicator",
                "which": "pop"
            }
        }
	}
});
```

##Entities

We can also select which entities will be visible on the chart. In the next example we make the graph display only the Nordics *and color them so that they look different*: 

<div id="bubble-chart-placeholder5" class="vizabi-placeholder no-border"></div>

<a onclick='openBubbleChartExample5()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BubbleChart', document.getElementById('placeholder'), { 
	state: {
	    "entities": {
	        "show": {
	            "filter": {
	                 "geo": [ "dnk", "fin", "isl", "nor", "swe"]
	             }
	        }
	    },
	    "marker": {
	        "color": {
	            "use": "property",
	            "which": "geo"
	        }
	    }
	}
});
```

##Language

Vizabi framework supports localisation. In the following example we switch the language to Swedish and provide a few language strings:

<div id="bubble-chart-placeholder6" class="vizabi-placeholder no-border"></div>

<a onclick='openBubbleChartExample6()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BubbleChart', document.getElementById('placeholder'), { 
	language: {
        id: "se",
        strings: {
            se: {
                "title": "Bubblar titel",
                "indicator/lex": "Livslängd",
                "indicator/gdp_per_cap": "BNP per capita",
                "indicator/pop": "Befolkning",
                "indicator/geo.region": "Region",
                "indicator/geo": "Geo kod",
                "indicator/time": "Tid",
                "indicator/geo.category": "Geo kategori",
                "scaletype/linear": "Linjär",
                "scaletype/log": "Logaritmisk",
                "scaletype/time": "Tid",
              }
        }
    }
});
```

<script>

function openBubbleChartExample() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function openBubbleChartExample2() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});", "<div id='placeholder' style='position: absolute; top: 0; bottom: 0; left: 0; right: 0;'></div>", "body{background:#ffffff}");
}

function openBubbleChartExample3() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { state:{'marker':{'color':{'palette':{'asi':'teal','ame':'limegreen','eur':'red','afr': 'deepskyblue'}}}}, data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function openBubbleChartExample4() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { state:{'marker':{'color':{'use':'indicator','which':'lex'},'axis_x':{'use':'indicator','which':'pop'}}}, data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function openBubbleChartExample5() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { state:{'entities':{'show':{'filter':{'geo':['dnk','fin','isl','nor','swe']}}},'marker':{'color':{'use':'property','which':'geo'}}}, data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function openBubbleChartExample6() {
	viewOnCodepen("Bubble Chart", "var viz = Vizabi('BubbleChart', document.getElementById('placeholder'), { language:{id:'se',strings:{se:{'title':'Bubblartitel','indicator/lex':'Livslängd','indicator/gdp_per_cap':'BNPpercapita','indicator/pop':'Befolkning','indicator/geo.region':'Region','indicator/geo':'Geokod','indicator/time':'Tid','indicator/geo.category':'Geokategori','scaletype/linear':'Linjär','scaletype/log':'Logaritmisk','scaletype/time':'Tid'}}}, data: { reader: 'csv-file', path: '"+CODEPEN_WAFFLE_ADDRESS+"' }});");
}

function flipDeviceBubbleChart() {
	var placeholder = document.getElementById("bubble-chart-placeholder2");
	var classes = placeholder.getAttribute("class");
	if(classes === "vizabi-placeholder mobile") {
		placeholder.setAttribute("class", "vizabi-placeholder mobile landscape");
	} else {
		placeholder.setAttribute("class", "vizabi-placeholder mobile");
	}

	//simulate window resize
	mobileBubbleChartViz.trigger('resize');
}

ready(function() {

	Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			}
		}
	);

	var mobileBubbleChartViz = Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder2'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			}
		}
	);


	Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder3'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			},
			state: {
		        "marker": {
		            "color": {
		                "palette": {
			                "asi": "teal",
			                "ame": "limegreen",
			                "eur": "red",
			                "afr": "deepskyblue"
		                }
		            }
		        }
		    }
		}
	);

	Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder4'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			},
			state: {
		        "marker": {
		            "color": {
		                "use": "indicator",
		                "which": "lex",
		            },
		            "axis_x": {
		                "use": "indicator",
		                "which": "pop",
		            }
		        }
		    }
		}
	);

	Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder5'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			},
			state: {
		        "entities": {
			        "show": {
			            "filter": {
			                 "geo": [ "dnk", "fin", "isl", "nor", "swe"]
			             }
			        }
			    },
			    "marker": {
			        "color": {
			            "use": "property",
			            "which": "geo"
			        }
			    }
		    }
		}
	);

	Vizabi('BubbleChart', document.getElementById('bubble-chart-placeholder6'), {
			data: {
				reader: 'csv-file',
				path: WAFFLE_ADDRESS
			},
			language: {
		        id: "pt",
		        strings: {
		            pt: {
		                "title": "Bubblar titel",
		                "indicator/lex": "Livslängd",
		                "indicator/gdp_per_cap": "BNP per capita",
		                "indicator/pop": "Befolkning",
		                "indicator/geo.region": "Region",
		                "indicator/geo": "Geo kod",
		                "indicator/time": "Tid",
		                "indicator/geo.category": "Geo kategori",
		                "scaletype/linear": "Linjär",
		                "scaletype/log": "Logaritmisk",
		                "scaletype/time": "Tid",
		              }
		        }
		    }
		}
	);

});
</script>
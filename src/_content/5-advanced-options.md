---
title: Advanced Options
slug: advanced-options
---

##Buttons

It is possible to add buttons that increase the exploration features of your chart.

<div id="advanced-placeholder" class="vizabi-placeholder"></div>

```js
Vizabi('BubbleChart', document.getElementById('placeholder'), { 
	ui: {
	    buttons: ['find', 'axes', 'size', 'colors',
	    		  'fullscreen', 'trails', 'lock', 'moreoptions']
	}
});
```

##Data Source

Vizabi has multiple readers, which can read data in various formats. Our current readers are:

- **csv-file**: reads data from a CSV file
- **json-file**: reads data from a JSON file
- **waffle-server**: Gapminder's REST API *(currently down)*
- **inline**: reads data from JS object at initialization

Most examples on this page are using the `csv-file` reader, using [this CSV file](http://static.gapminderdev.org/vizabi/waffles/en/basic-indicators.csv).

But let's use the **inline** reader instead with our own data in our next example:

<div id="advanced-placeholder2" class="vizabi-placeholder"></div>

<a onclick='openAdvancedExample2()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
Vizabi('BarChart', document.getElementById('placeholder'), {
	data: {
		reader: 'inline',
		data: [{ 'geo': 'swe', 'time': '1995', 'score': '10'},
			   { 'geo': 'swe', 'time': '1996', 'score': '13'},
			   { 'geo': 'swe', 'time': '1997', 'score': '14'},
			   { 'geo': 'swe', 'time': '1998', 'score': '15'},
			   { 'geo': 'swe', 'time': '1999', 'score': '16'},
			   { 'geo': 'swe', 'time': '2000', 'score': '18'},
			   { 'geo': 'fin', 'time': '1995', 'score': '10'},
			   { 'geo': 'fin', 'time': '1996', 'score': '10'},
			   { 'geo': 'fin', 'time': '1997', 'score': '14'},
			   { 'geo': 'fin', 'time': '1998', 'score': '18'},
			   { 'geo': 'fin', 'time': '1999', 'score': '22'},
			   { 'geo': 'fin', 'time': '2000', 'score': '25'},
 		]
	},
	state: {
		entities: {
            show: {
                dim: 'geo',
                filter: {
                    'geo': ['*']
                }
            }
        },
        marker: {
            label: {
                use: 'property',
                which: 'geo'
            },
            color: {
                use: 'property',
                which: 'geo'
            },
            axis_y: {
                use: 'indicator',
                which: 'score'
            },
            axis_x: {
                use: 'property',
                which: 'geo'
            }
        }
	}
});
```

<script>

function openAdvancedExample2() {
	viewOnCodepen("Inline Reader", "Vizabi('BarChart',document.getElementById('placeholder'),{data:{reader:'inline',data:[{'geo':'swe','time':'1995','score':'10'},{'geo':'swe','time':'1996','score':'13'},{'geo':'swe','time':'1997','score':'14'},{'geo':'swe','time':'1998','score':'15'},{'geo':'swe','time':'1999','score':'16'},{'geo':'swe','time':'2000','score':'18'},{'geo':'fin','time':'1995','score':'10'},{'geo':'fin','time':'1996','score':'10'},{'geo':'fin','time':'1997','score':'14'},{'geo':'fin','time':'1998','score':'18'},{'geo':'fin','time':'1999','score':'22'},{'geo':'fin','time':'2000','score':'25'},]},state:{entities:{show:{dim:'geo',filter:{'geo':['*']}}},marker:{label:{use:'property',which:'geo'},color:{use:'property',which:'geo'},axis_y:{use:'indicator',which:'score'},axis_x:{use:'property',which:'geo'}}}});");
}

ready(function() {

	Vizabi('BubbleChart', document.getElementById('advanced-placeholder'), {
		data: {
			reader: 'csv-file',
			path: WAFFLE_ADDRESS
		},
		ui: {
		    buttons: ['find', 'axes', 'size', 'colors', 'fullscreen', 'trails', 'lock', 'moreoptions']
		}
	});

	Vizabi('BarChart', document.getElementById('advanced-placeholder2'), {
		data: {
			reader: 'inline',
			data: [{ 'geo': "swe", 'time': "1995", 'score': "10"},
				   { 'geo': "swe", 'time': "1996", 'score': "13"},
				   { 'geo': "swe", 'time': "1997", 'score': "14"},
				   { 'geo': "swe", 'time': "1998", 'score': "15"},
				   { 'geo': "swe", 'time': "1999", 'score': "16"},
				   { 'geo': "swe", 'time': "2000", 'score': "18"},
				   { 'geo': "fin", 'time': "1995", 'score': "10"},
				   { 'geo': "fin", 'time': "1996", 'score': "10"},
				   { 'geo': "fin", 'time': "1997", 'score': "14"},
				   { 'geo': "fin", 'time': "1998", 'score': "18"},
				   { 'geo': "fin", 'time': "1999", 'score': "22"},
				   { 'geo': "fin", 'time': "2000", 'score': "25"},
	 		]
		},
		state: {
			entities: {
	            show: {
	                dim: "geo",
	                filter: {
	                    "geo": ["*"]
	                }
	            }
	        },
	        marker: {
	            label: {
	                use: "property",
	                which: "geo"
	            },
	            color: {
	                use: "property",
	                which: "geo"
	            },
	            axis_y: {
	                use: "indicator",
	                which: "score"
	            },
	            axis_x: {
	                use: "property",
	                which: "geo"
	            }
	        }
		}
	});

});

</script>
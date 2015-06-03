---
title: Creating own tool
slug: creating-own-tool
---

Let’s make a simple donut chart, showing world population share by regions. The result looks like this:

<div id="bubble-chart-placeholder" class="vizabi-placeholder no-border"></div>

Vizabi is organised as a base plus a collection of “tools”. Tools are like apps. We have some already: bubble chart, line chart, bar chart, also you can write your own. The tools consist of “components”, which are the elementary blocks. The “donutchart” tool above includes components “donut” and “gapminder-timeslider”. The latter one is also used by bar and line charts, so components can be reusable.

##Skeleton

We start with a skeleton like this:

```html  
<!DOCTYPE html> 
<meta charset="utf-8">
<body>
<link rel="stylesheet" type="text/css" href="http://static.gapminderdev.org/vizabi/develop/dist/vizabi.css">
<div id='placeholder' style='width: 600px; height: 400px'></div>    
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://static.gapminderdev.org/vizabi/develop/dist/vizabi.min.js"></script>
<script>

    //here goes all the code
    
</script>
</body>
```  
 
##Creating a tool

Let's start from a tool. 

We extend the base Tool class and register it in Vizabi tools collection under a name 'DonutChart'. The new tool will only have "init" method, here is the outline:

```js
    Vizabi.Tool.extend('DonutChart', {

        //Run when the tool is created
        init: function(config, options) {

            this.name = "donutchart";

            this.components = [
                // ...
                // put components here
                // ...
            ];

            this.default_options = {
                // ...
                // put default options here
                // ...
            };

            //constructor is the same as any tool
            this._super(config, options);
        }
    });
```

##Including a component
Let's include a time slider component. First we choose which component to use, by providing its name. Once Vizabi is defined, we can stop on a breakpoint and check Vizabi.Component.getCollection() to see which components are available.

Then we give a placeholder selector, if we need the component to be rendered on screen somewhere (these placeholdes are defined by the template in Tool.js).

Finally, we list the models our component should have access to. The result would be:

```js
this.components = [{
    component: 'gapminder-timeslider',
    placeholder: '.vzb-tool-timeslider',
    model: ["state.time"]
}];
```

We will add one more component, our own 'donut'. It does not exist yet, but we will make it soon. Besides time it needs one more model, marker:

```js
this.components = [{
    component: 'donut', 
    placeholder: '.vzb-tool-viz', 
    model: ["state.time", "state.marker"] 
}, {
    component: 'gapminder-timeslider',
    placeholder: '.vzb-tool-timeslider',
    model: ["state.time"]
}];
```

##Default options
These are the parameters and state settings that would be set if they are not provided in the URL or by the container page. 

We set time to have the range of 1990-2012 years, with the deafult position at 2000. We let entities include all ("*") geo's of category "regions", which is equivalent to explicitly writing 'geo: ["asi", "ame", "eur", "afr"]'. 

```js

this.default_options = {
    state: {
        time: {
            start: "1990",
            end: "2012",
            value: "2000"
        },
        entities: {
            show: {
                dim: "geo",
                filter: {
                    _defs_: {
                        "geo": ["*"],
                        "geo.category": ["region"]
                    }
                }
            }
        },
        marker: {
            dimensions: ["entities", "time"],
            label: {
                use: "property",
                which: "geo.name"
            },
            axis: {
                use: "indicator",
                which: "pop"
            },
            color: {
                use: "property",
                which: "geo.region"
            }
        }
    },

    //default language. Let's keep it minimal for now
    language: {
        id: "en"
    }
};
```

Markers correspond to visual dimensions we want to show. We have label, axis and color which would handle the data magic and give us labels, population and color of regions at any point of time.

Finally, we include language pointer "en". The meaning is that you would have language strings here as well, but we skip it for now.

And the tool is done.


##Creating a component
As with the tool, let's start from an outline

```js
Vizabi.Component.extend('donut', {

    init: function(config, context) {
        // ...
        // happens once when component is created, before model or DOM are ready
        // ...
    },

    readyOnce: function() {
        // ...
        // happens once on the load when both DOM and MODEL are ready
        // ...
    },

    updateEntities: function(){
        // ...
        // populate the visuals according to the number of entities
        // ...
    },

    update: function() {
        // ...
        // updates the visuals for the new time value
        // ...
    },

    resize: function() {
        // ...
        // executes every time the container or vizabi is resized
        // ...
    }

});
```

##Component init
The init function will have the following:


```js
init: function(config, context) {
    var _this = this;

    this.name = 'donutchart';
    
    //provide the template as a string
    this.template = '<div class="vzb-donutchart"><svg class="vzb-donutchart-svg"></svg></div>';

    //define expected models for this component
    this.model_expects = [
        {name: "time", type: "time"},
        {name: "marker", type: "model"}
    ];

    //bind the function update() to the change of time value in the model
    this.model_binds = {
        "change:time:value": function(evt) {
            _this.update();
        }
    };

    //call the prototype constructor of the component
    this._super(config, context);

    //init variables for d3 pie layout
    this.colorScale = null;
    this.arc = d3.svg.arc();
    this.pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.pop; });
},
```

##Appending Vizabi tool to a DOM element
Finally we need to point our tool to the data and append it to 'placeholder' div element:

```js
Vizabi('DonutChart', document.getElementById('placeholder'), 
    {data: { reader: 'csv-file', path: 'https://dl.dropboxusercontent.com/u/4933279/Gapminder/waffles/{{LANGUAGE}}/basic-indicators.csv' }}
);
```


With that, the donut chart is finished.
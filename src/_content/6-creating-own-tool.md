---
title: Creating own tool
slug: creating-own-tool
---

Let’s make a simple donut chart, showing world population share by regions. The result looks like this:

<div id="donut-chart-placeholder" class="vizabi-placeholder no-border"></div>

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

##Component.init
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
            //fetch the time from the model and update the text on screen
            _this.time = _this.model.time.value;            
            _this.yearEl.text(_this.timeFormatter(_this.time));                    
            _this.redraw();
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

##Component.readyOnce
This function is only called once after the data model and the dom are both ready for the first time. This allows to do the preparations before kicking off the startup sequence.

```js
readyOnce: function() {
    var _this = this;

    //link DOM elements to the variables
    this.element = d3.select(this.element)
    this.svgEl = this.element.select("svg").append("g");
    this.yearEl = this.svgEl.append("text").attr("class", "year");
    this.titleEl = this.svgEl.append("text").attr("class", "title");

    //bind the resize() and update() events to container resize
    this.on("resize", function() {
        _this.resize();
        _this.redraw();
    });            

    //run a startup sequence
    this.resize();
    this.update();
    this.redraw();
},
```

##Component.resize
This function is called every time when the container is resized and allows the responsive behavior.

```js
resize: function() {

    var height = parseInt(this.element.style("height"));
    var width = parseInt(this.element.style("width"));
    var min = Math.min(height, width);

    this.svgEl.attr("transform","translate("+(width/2)+","+(height/2)+")");
    this.titleEl.attr("y", "-0.1em");
    this.yearEl.attr("y", "0.1em");

    this.arc
        .outerRadius(min/2 * 0.9)
        .innerRadius(min/2 - min * 0.1)
}
```

##Component.update
This function updates everything that depends on the state parameters except the current time. It should be not exec

```js
update: function(){
    this.timeFormatter = d3.time.format(this.model.time.formatInput);
    this.colorScale = this.model.marker.color.getScale();

    this.titleEl.text("Population");
    this.items = this.model.marker.label.getItems();

    this.entities = this.svgEl.selectAll('.vzb-dc-entity')
        .data(this.items);

    //exit selection
    this.entities.exit().remove();

    //enter selection
    this.entities
        .enter().append("g")
        .attr("class", "vzb-dc-entity")
        .each(function(){
        d3.select(this).append("path");
        d3.select(this).append("text").attr("class","label");
    });
}
```

##Component.redraw
This function requests the data for the current time point and updates the visuals

 ```js
redraw: function() {
    var _this = this;

    //prepare the data and request the values for the current time from the model
    var data = utils.clone(this.items);

    data.forEach(function(d){
        d.pop = _this.model.marker.axis.getValue({geo: d.geo, time: _this.time});
        d.color = _this.model.marker.color.getValue({geo: d.geo, time: _this.time});
        d.label = _this.model.marker.label.getValue({geo: d.geo, time: _this.time});
    });

    data = this.pie(data);

    //set the properties of the donuts and text labels
    this.entities
        .data(data)
        .select("path")
        .attr("d", this.arc)
        .style("fill", function(d) { return _this.colorScale(d.data.color) })
        .style("stroke", "white")

    this.entities
        .select("text")
        .attr("transform", function(d) { return "translate(" + _this.arc.centroid(d) + ")"; })
        .text(function(d) { return d.data.label; });            
}
```



##Responsiveness in CSS
Here we added some additional styling to make the chart look good. Note how profiles large, medium and small are applied to change the font size.

```css
.vzb-donutchart{
    position: absolute;
    top: 0px; left: 0px; rigth: 0px; bottom: 0px;
    font-family: 'Arial Rounded MT Bold', Arial, sans-serif;
    width: 100%; height: 100%;
}
.vzb-donutchart svg{width:100%; height:100%}

.vzb-donutchart text {text-anchor: middle; fill: rgb(96, 120, 137)}

.vzb-donutchart .year {dominant-baseline: hanging; fill: #DDD;}

.vzb-large .vzb-donutchart .year{font-size: 8.0em;}
.vzb-large .vzb-donutchart .title{font-size: 4.0em;}
.vzb-large .vzb-donutchart .label{font-size: 2.0em;}

.vzb-medium .vzb-donutchart .year {font-size: 8.0em;}
.vzb-medium .vzb-donutchart .title {font-size: 4.0em;}
.vzb-medium .vzb-donutchart .label {font-size: 2.0em;}

.vzb-small .vzb-donutchart .year {font-size: 4.0em;}
.vzb-small .vzb-donutchart .title {font-size: 2.0em;}
.vzb-small .vzb-donutchart .label {font-size: 1.0em;}
```



##Appending Vizabi tool to a DOM element
Finally we need to point our tool to the data and append it to 'placeholder' div element:

```js
Vizabi('DonutChart', document.getElementById('placeholder'), 
    {data: { reader: 'csv-file', path: 'https://dl.dropboxusercontent.com/u/4933279/Gapminder/waffles/en/basic-indicators.csv' }}
);
```


With that, the donut chart is finished.







<script>
ready(function() {



    var utils = Vizabi.utils;

    //extend the base Tool class and register it in Vizabi tools under a name 'DunutChart'
    Vizabi.Tool.extend('DonutChart', {

        //Run when the tool is created
        init: function(config, options) {

            //Let's give it a name
            this.name = "donutchart";

            //Now we can specify components that should be included in the tool: 
            this.components = [{
                //choose which component to use:
                //at this point you can check Vizabi.Component.getCollection() to see which components are available
                component: 'donut', 
                //these placeholdes are defined by the Tool prototype class
                placeholder: '.vzb-tool-viz', 
                //component should have access to the following models:
                model: ["state.time", "state.marker"] 
            }, {
                component: 'gapminder-timeslider',
                placeholder: '.vzb-tool-timeslider',
                model: ["state.time"]
            }];

            //provide the default options
            this.default_options = {
                state: {
                    // available time would have the range of 1990-2012 years (%Y), with the deafult position at 2000
                    time: {
                        start: "1990",
                        end: "2012",
                        value: "2000"
                    },
                    //Entities include all ("*") geo's of category "regions" -- equivalent to 'geo: ["asi", "ame", "eur", "afr"]'
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
                    //Markers correspond to visuals that we want to show. We have label, axis and color
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

            //constructor is the same as any tool
            this._super(config, options);
        }

    });
    
    
    
    
    
    
    

    //DONUT CHART COMPONENT
    Vizabi.Component.extend('donut', {

        init: function(config, context) {
            var _this = this;

            this.name = 'donutchart';
            this.template = '<div class="vzb-donutchart"><svg class="vzb-donutchart-svg"></svg></div>';

            //define expected models for this component
            this.model_expects = [
                {name: "time", type: "time"},
                {name: "marker", type: "model"}
            ];
            
            //bind the function updateTime() to the change of time value in the model
            this.model_binds = {
                "change:time:value": function(evt) {
                    //fetch the time from the model and update the text on screen
                    _this.time = _this.model.time.value;            
                    _this.yearEl.text(_this.timeFormatter(_this.time));                    
                    _this.redraw();
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

        /**
         * DOM is ready and the model is ready -- happens once on the load and never again
         */
        readyOnce: function() {
            var _this = this;

            //link DOM elements to the variables
            this.element = d3.select(this.element)
            this.svgEl = this.element.select("svg").append("g");
            this.yearEl = this.svgEl.append("text").attr("class", "year");
            this.titleEl = this.svgEl.append("text").attr("class", "title");

            //bind the resize() and updateTime() events to container resize
            this.on("resize", function() {
                _this.resize();
                _this.redraw();
            });            
        
            //run a startup sequence
            this.resize();
            this.update();
            this.redraw();
        },


        /**
         * Populate the visuals according to the number of entities
         */
        update: function(){
            this.timeFormatter = d3.time.format(this.model.time.formatInput);
            this.colorScale = this.model.marker.color.getScale();
            
            this.titleEl.text("Population");
            this.items = this.model.marker.label.getItems();
            
            this.entities = this.svgEl.selectAll('.vzb-dc-entity')
                .data(this.items);

            //exit selection
            this.entities.exit().remove();

            //enter selection
            this.entities
                .enter().append("g")
                .attr("class", "vzb-dc-entity")
                .each(function(){
                d3.select(this).append("path");
                d3.select(this).append("text").attr("class","label");
            });
        },
        
        
        /**
         * Updates the visuals
         */
        redraw: function() {
            var _this = this;

            //prepare the data and request the values for the current time from the model
            var data = utils.clone(this.items);
            
            data.forEach(function(d){
                d.pop = _this.model.marker.axis.getValue({geo: d.geo, time: _this.time});
                d.color = _this.model.marker.color.getValue({geo: d.geo, time: _this.time});
                d.label = _this.model.marker.label.getValue({geo: d.geo, time: _this.time});
            });
            
            data = this.pie(data);

            //set the properties of the donuts and text labels
            this.entities
                .data(data)
                .select("path")
                .attr("d", this.arc)
                .style("fill", function(d) { return _this.colorScale(d.data.color) })
                .style("stroke", "white")

            this.entities
                .select("text")
                .attr("transform", function(d) { return "translate(" + _this.arc.centroid(d) + ")"; })
                .text(function(d) { return d.data.label; });            
        },

        /**
         * Executes every time the container or vizabi is resized
         */
        resize: function() {

            var height = parseInt(this.element.style("height"));
            var width = parseInt(this.element.style("width"));
            var min = Math.min(height, width);
            
            this.svgEl.attr("transform","translate("+(width/2)+","+(height/2)+")");
            this.titleEl.attr("y", "-0.1em");
            this.yearEl.attr("y", "0.1em");
            
            this.arc
                .outerRadius(min/2 * 0.9)
                .innerRadius(min/2 - min * 0.1)
        }
        
    });
    
    
    
    
    
    
    
    //point to the data and append the Vizabi DonutChart to 'placeholder' div
    Vizabi('DonutChart', document.getElementById('donut-chart-placeholder'), 
        {data: { reader: 'csv-file', path: WAFFLE_ADDRESS }}
    );
    
    
    
});


</script>
---
title: Vizabi Framework
slug: vizabi-framework
---

>As a framework, Vizabi provides a number of features in order to ease development of new tools, while maintaining consistency between them.

When you add Vizabi to a page, `Vizabi` will be added to the global scope.

```html
<script type="text/javascript" src="path/to/vizabi.js"></script>
<script type="text/javascript">
	console.log(Vizabi);
</script>
```

You can use it to initialize existing tools, like the *[BubbleChart](#bubble-chart)* or *[LineChart](#line-chart)*, or extend the framework with new functionality.

---

##Vizabi.Class

Provides basic prototype inheritance to all Vizabi classes. It also provides the useful method `_super`, which can be used to call the super class method.

```js
var Animal = Vizabi.Class.extend({
    init: function() {
        this.alive = true;
    },
    move: function() {
        return "It is moving";
    }
});

var Dog = Animal.extend({
    init: function() {
        this.barking = true;
        this._super(); //calls super init
    }
});

var doug = new Dog();
//expect doug.alive = true
//expect doug.move() to return "It is moving"
```

It also allows classes to be registered in collections. This is particularly useful when defining reusable components.

```js
Animal.extend('Cat', {
    init: function() {
        this.smart = true;
        this._super();
    }
});

var animals = Animal.getCollection();
//expect animals to contain 'Cat'

var myCat = new Animal.get('Cat');
//myCat is an instance of Cat
```

---

##Vizabi.utils

Provides basic utility functions. [See all here](https://github.com/Gapminder/vizabi/blob/develop/src/base/utils.js). Example:

```js
var u = Vizabi.utils.unique([1,2,2,2,2,3]);
//u = [1, 2, 3]
```

---

##Vizabi.Promise

Basic promises implementation. Example:

```js
var promise = new Vizabi.Promise();
promise.then(function() {
	console.log('done');
});
promise.resolve();
```

---

##Vizabi.Events

Base class for events. It provides useful functionality such as `on` and `trigger`:

```js
var myEvents = new Vizabi.Events();
myEvents.on("shout", function() {
	console.log("Hello World");
});

myEvents.trigger("shout");
//prints "Hello World" to console;
```

It also allows for more advanced binding formats and triggering multiple events:

```js
var myEvents = new Vizabi.Events();
myEvents.on({
	"shout": function() {
		console.log("Hello World");
	},
	"shout:loud": function() {
		console.log("HELLO WORLD!");
	}
);

myEvents.trigger("shout:loud");
//prints "HELLO WORLD!" to console;

myEvents.triggerAll("shout:loud");
//prints "HELLO WORLD!" and "Hello World" to console;
```

---

##Vizabi.Model

Base class for models. It extends `Vizabi.Events`. Models come with basic setters and getters. It also triggers special events.

```js
var m = new Vizabi.Model({
	value: 1800,
    start: 1800,
    end: 2015,
    submodel: {	//objects become submodels
        value: "test"
    }
});

console.log(m.value); //prints "1800" to console;

m.on('change:value', function() {
	console.log("value changed!");
});

m.value = 1990;
//triggers 'change:value' and prints "value changed!" to console
```

There are some special models that we call **hooks**. They have the properties `use` and `which` and they are used to bind a model to data. These types of models have *super powers*. They can request data and map data points. There's a section dedicated to these types of models.

###Extending Vizabi.Model

Vizabi comes with many built-in models/hooks. You can find them under [`src/models`](https://github.com/Gapminder/vizabi/tree/develop/src/models) . All of them extend `Vizabi.Model`. You can also create your own model like this:

```js
var myModel = Vizabi.Model.extend({ /*methods*/ });
```

And you can register your model (if reusable):

```js
Vizabi.Model.extend('mymodel', { /*methods*/ });
```

Vizabi built-in models use the later syntax. You can also see all registered models with ```Vizabi.Model.getCollection()```.

###Validation

All models execute `validation` after any change. This is useful to guarantee consistency. Check out the example below

```js
var MyModel = Vizabi.Model.extend({
	init: function(values, parent, bind) {
		//defaults
		values = Vizabi.utils.extend({
            value: 1800, start: 1800, end: 2015,
        }, values);
        this._super(values, parent, bind);
	},
	//validate is always called after changing the model
	validate: function() {
		if(this.start > this.end) this.end = this.start;
		if(this.value > this.end || this.value < this.start)
			this.value = this.start;
	}	
});

m = new MyModel({ start: 2000, end: 2010, value: 2020 });
m.value; //should be 2000 because of validation rule

```

---

##Vizabi.Component

Base class for components. It extends `Vizabi.Events`. You may think of `Vizabi.Component` similar to a Controller-View. Components can be rendered to a DOM element and have support for templating and model binding.

The following example shows a very simple component implementation:

```js
//create a new component fo year display
var YearDisplay = Vizabi.Component.extend({
    init: function(config, parent) {
        this.name = "year-display";
        this.template = "<h2><%= time %></h2>";
        this.template_data = { time: "2012" };
        this._super(config, parent);
    }
});

var c = new YearDisplay({
    placeholder: document.getElementById('placeholder');
});

c.render();

/*
 * at this point, #placeholder should contain the following html: 
 * <h2>2012</h2>
 */
```

Components may also be registered if reusable. Example:

```js
Vizabi.Component.extend('year-display', { /*methods*/ });
```

Vizabi comes with many built-in reusable components. You can find them under [`src/components`](https://github.com/Gapminder/vizabi/tree/develop/src/components) . All of them extend `Vizabi.Component`.


###Sub-components
Components may also instantiate subcomponents. Assuming `year-display` from the previous example is registered, we can create a new component that uses it.

```js
var MyComp = Vizabi.Component.extend({
    init: function(config, parent) {
        this.name = 'my_component';
        this.template = '<div><div class="display"></div></div>';

        //'year-display' component will be rendered in the .display div
        this.components = [{
            component: 'year-display', placeholder: '.display'
        }];
        this._super(config, parent);
    }
});

var c = new MyComp({
    placeholder: document.getElementById('placeholder');
});

c.render();

/*
 * at this point, #placeholder should contain the following html: 
 * <div><div class="display"><h2>2012</h2></div></div>
 */

```

###Model binding

The following code is an example of model binding at a component level:


<a onclick='openComponentModelExample()' class="button code-btn"><i class='fa fa-codepen'></i> Codepen</a>

```js
//create a new model
var TimeModel = Vizabi.Model.extend('mytime', {
    init: function(values, parent, bind) {
        this._type = "time";
        //default values for time model
        values = Vizabi.utils.extend({
            value: 1800, start: 1800, end: 2015
        }, values);
        this._super(values, parent, bind);
    }
});

var YearDisplay = Vizabi.Component.extend({
    init: function(config, parent) {
        this.name = "year-display";
        this.template = "<h2><%= time %></h2>";
        this.model = new TimeModel();
        this.template_data = {
            time: this.model.value //value from model
        };
        this._super(config, parent);

        var _this = this;
        this.model.on({
            'change': function() {
                _this.update();
            }
        });
    },
    update: function(evt) {
        this.element.innerHTML = this.model.value;
    }
});

var component = new YearDisplay({
	placeholder: document.getElementById('placeholder')
});

component.render();

/*
 * at this point, #placeholder should contain the following html: 
 * <h2>1800</h2>
 */

component.model.value = 2012;

/*
 * at this point, #placeholder should contain the following html: 
 * <h2>2012</h2>
 */
```

###Useful methods

Every `Vizabi.Component` has three special methods:

- **resize()**: called when the container detects a resize event
- **readyOnce()**: called only once when *both* compoment's DOM and model are ready
- **ready()**: called when DOM and model are ready (multiple times)

Since we know that the DOM is ready in these methods, we can use `this.element` to access the root node of the component's template and `this.placeholder` to access the placeholder node. Example:

```js
var myComponent = Vizabi.Component.extend({
    init: function(config, parent) {
        //...
    },
    readyOnce: function(evt) {
        this.element.innerHTML = "Hello World";
    },
    ready: function(evt) {
        this.element.innerHTML = "I'm ready!";
    },
    resize: function(evt) {
        this.element.innerHTML = "I'm resizing!";
    }
});
```

And since we know that the model is ready in `readyOnce` and `ready`, we can use `this.model` to access its properties and data:

```js
var myComponent = Vizabi.Component.extend({
    init: function(config, parent) {
        //...
    },
    ready: function(evt) {
        console.log(this.model);
    }
});
```

Checkout how Vizabi's timeslider component uses such methods [here](https://github.com/Gapminder/vizabi/blob/develop/src/components/_gapminder/timeslider/timeslider.js#L105).

*Note that listening to the model's `ready` event is different than using the component's `ready()` method, because in the later, we ensure that the DOM is also ready, not only the model*

---

##Vizabi.Tool

Vizabi tools are the ultimate wrapper, the final packaging of our components. Think of it as an app. `Vizabi.Tool` extends `Vizabi.Component`, so they are essentially a component (which means they can render and include components) with an extra touch.

Vizabi tools have `default_options`, which basically describe the entire model structure of the tool and include other models. Moreover, they have a special model and template. Finally, they have their own `validate` method which allows for cross model validation.

For more details, checkout [how LineChart is implemented](https://github.com/Gapminder/vizabi/blob/develop/src/tools/linechart/linechart-tool.js#L19).

###Built-in tools

Vizabi currently ships with three built-in Tools: [BubbleChart](#bubble-chart), [LineChart](#line-chart) and [BarChart](#bar-chart). 

You can initialize registered tools with the following:

```js
Vizabi("<ToolName>", document.getElementById("<id_placeholder>"), {
	/* options */
});

```


<script>
	function openComponentModelExample() {
		viewOnCodepen("Component-Model", "var TimeModel=Vizabi.Model.extend('mytime',{init:function(values,parent,bind){this._type='time';values=Vizabi.utils.extend({value:1800,start:1800,end:2015},values);this._super(values,parent,bind)}});var YearDisplay=Vizabi.Component.extend({init:function(config,parent){this.name='year-display';this.template='<h2><%= time %></h2>';this.model=new TimeModel();this.template_data={time:this.model.value};this._super(config,parent);var _this=this;this.model.on({'change':function(){_this.update()}})},update:function(evt){this.element.innerHTML=this.model.value}});var component=new YearDisplay({placeholder:document.getElementById('placeholder')});component.render();component.model.value=2012;");
	}
</script>
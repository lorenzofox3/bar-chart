

# barbapapa

Web components to build bar charts in a declarative way. It "costs" 1292 bytes minified and compressed. It uses actual DOM elements, which gives you a lot of customization possibilities with regular CSS.
It supports out of the box horizontal/vertical bars, multiple series and stacked bars  

A Bar chart presents categorical data with rectangular (or not) bars whose size is proportional to the values they represent within a domain of definition.

## Usage 

you can install the custom elements locally on you machine using a package manager, or directly import the file from a cdn inside you HTML document. 
Once the custom elements are defined, it is as simple as adding the element tags in your HTML document. 

```html
<script src="https://cdn.jsdelivr.net/npm/barbapapa/bar-chart.min.js"></script>

<!-- somewhere in you html-->

<bpapa-bar-chart domain-min="0" domain-max="100">
    <span slot="category">label 1</span>
    <bpapa-bar value="4"></bpapa-bar>
    <span slot="category">label 2</span>
    <bpapa-bar value="12"></bpapa-bar>
    <span slot="category">label 3</span>
    <bpapa-bar value="56"></bpapa-bar>
    <span slot="category">label 4</span>
    <bpapa-bar value="32"></bpapa-bar>
</bpapa-bar-chart>


```

You can then use regular css to customize your graph if needed.

You can play around with the [following codepen](https://codepen.io/lorenzofox3/pen/RwdvwZM)

### elements

#### bpapa-bar-chart

It is the root component. It has few (reactive) attributes: **domain-min**, **domain-max**, **stack** and **horizontal**.

**domain-*** define the data range. If not provided, they take the minimum and maximum values of the bars. 

**stack**: if present, it will stack the bars when they are in a bar-group

**horizontal**: if present, the bars will be horizontal

It emits the **rendered** event whenever a rendering finishes.

Any element with the slot name **category** will be associated to the new category. They follow the order of definition to be associated with the matching bar/bar-group: the first occurrence of a category will be associated with the first bar, etc

#### bpapa-bar

It defines a bar of your dataset and takes a single attribute: **value** which represents the domain value associated with the bar.

#### bpapa-group

Let you group bars together. It is useful if you want to have multiple series (several bars associated with a single category). If the parent bpapa-bar-chart has the **stack** attribute the bars will stack on top of each other

```html
<bpapa-bar-chart stack>
    <bpapa-bar-group>
        <bpapa-bar value="42"></bpapa-bar>
        <bpapa-bar value="56"></bpapa-bar>
    </bpapa-bar-group>
    <bpapa-bar-group>
        <bpapa-bar value="32"></bpapa-bar>
        <bpapa-bar value="16"></bpapa-bar>
    </bpapa-bar-group>
    <!-- etc -->
</bpapa-bar-chart>
```

## examples 

There are a bunch of examples provided in the repository so you can see how easy it is to customize you bar chart


### Simple example

It provides an example of the canonical bar chart. You can toggle the linear axis and the orientation. It is made responsive thanks to basic css code involving query containers

https://github.com/lorenzofox3/bar-chart/assets/2402022/343fd444-3a5b-4897-9f44-11fff85bf2a2

### multiple series example

Basic multiple series example which let you toggle the direction, the stacking mode and the visibility of the series

https://github.com/lorenzofox3/bar-chart/assets/2402022/1bd291ea-39a6-494b-a3d2-e85d93707f23

### time series example

It has a dynamic dataset which gets updated every second. Time series are technically not adpated to bar charts, but here you have a existing example

https://github.com/lorenzofox3/bar-chart/assets/2402022/c867129b-564e-4c07-bf99-f077fc86b01f

### CSS fun

It shows how far you can go with the customization. With canvas based implementation, you are limited to what the framework offer. Here you can use the whole power of css

https://github.com/lorenzofox3/bar-chart/assets/2402022/4e23c43f-1b97-4bdc-be81-bc23fe52e55f


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSampleArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var list = [];
    for (var i = 0; i < sample_values.length; i++) {
      list.push({
        'otu_id': otu_ids[i], 'otu_label': otu_labels[i], 'sample_value': sample_values[i]
      });
    }
    var sortedList = list.sort((a,b) => b.sample_value - a.sample_value);
    var names = [];
    var xticks = [];
    var yticks = [];
    
    for (var i = 0; i < 10; i++) {
      names[10 - i] = sortedList[i].otu_label;
      xticks[10 - i] = sortedList[i].sample_value;
      yticks[10 - i] = sortedList[i].otu_id;
    }
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      text: names,
      x: xticks,
      y: yticks.map(label => "OTU " + String(label)),
      type: "bar",
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);





    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      text: otu_labels,
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bateria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



    // Deliverable 3
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = filteredMetadataArray[0];
    console.log(metadataResult);

    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(metadataResult.wfreq)
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: "Scrubs per Week",
      gauge: {
        axis: { range: [null, 10], dtick: 2},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Belly Button Washing Frequency",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

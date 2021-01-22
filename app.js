// // Just checking out the data; delete once finished
// d3.json("samples.json").then((data) => {
//     console.log("Hello World")
//     console.log(data)
// })

function displayMetadata(value) {
    d3.json("samples.json").then((data) => {
        var metadataArray = data.metadata.filter(selected => selected.id == value);
        var metadata = metadataArray[0];
        console.log(metadata)
        let wordbox = d3.select("#sample-metadata");
        wordbox.html("") // resets html to be blank
        // this should work just like on the ufo assignment....
        Object.entries(metadata).forEach(([key,value]) => {
            wordbox.append("h6").text(`${key} : ${value}`)
        })
    })
}

// This function gets called by init() and makes the bar chart
function makeBar(value) {
    // console.log(value); // Checking to see that the function is passing the dropdown value
    d3.json("samples.json").then((data) => {
        // Need to grab the associated data with our user selected name
        var ourNameArray = data.samples.filter(selected => selected.id == value);
        var ourName = ourNameArray[0]; // initially gives array with dictionary, so we need to select the first one

        // this is going to be hard...we need to get the values and their corresponding names?
        var yvals = ourName.otu_ids.slice(0,10).map(mapped => `OTU ${mapped}`) // need to use a map to associate the ID with the result
        var xvals = ourName.sample_values.slice(0,10)

        var barData = [
            {
                x: xvals.reverse(),
                y: yvals.reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];

        var barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 70, l: 75 }
          };
        Plotly.newPlot('bar',barData, barLayout);
    })
};

// This function gets called by init() and makes the Michael Bubble chart
function makeBubble(value) {
    d3.json("samples.json").then((data) => {
        // Need to grab the associated data with our user selected name
        var ourNameArray = data.samples.filter(selected => selected.id == value);
        var ourName = ourNameArray[0]; // initially gives array with dictionary, so we need to select the first one

        // this is going to be hard...we need to get the values and their corresponding names?
        var yvals = ourName.otu_ids
        var xvals = ourName.sample_values
        var bubbleData = [
            {
                x: xvals,
                y: yvals,
                mode: "markers",
                marker: {
                    size: 12,
                    opacity: 0.5
                }
            }
        ]

        var bubbleLayout = {
            title: "Top 10 OTUs",
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout)
    })
};

function init () {
    var valueSelected = d3.select("#selDataset"); // Here we are selecting the dropdown button
    d3.json("samples.json").then((data) => { //use an arrow function with the then to make sure samples.json loads first
        var sampleNames = data.names; // The json file has the sample IDs called 'names' so we are grabbing them all here to display

        sampleNames.forEach((sample) => { // Using forEach to run through each of the samples and throwing the name into the dropdown menu
            valueSelected
                .append("option")
                .text(sample)
                .attr("something",sample);
        });
    })
    makeBar(940);
    makeBubble(940);
    displayMetadata(940);
};

function optionChanged(value){
    makeBar(value);
    makeBubble(value);
    displayMetadata(value);
};

init();
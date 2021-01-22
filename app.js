// This is the event handler to take update everything when the user selects a new value
function optionChanged(value){
    makeBar(value);
    makeBubble(value);
    displayMetadata(value);
};

// This function gets called by init() and makes the bar chart
function makeBar(value) {
    // console.log(value); // Checking to see that the function is passing the dropdown value
    d3.json("samples.json").then((data) => {
        // Need to grab the associated data with our user selected name
        let ourNameArray = data.samples.filter(selected => selected.id == value);
        let ourName = ourNameArray[0]; // initially gives array with dictionary, so we need to select the first one

        // this is going to be hard...we need to get the values and their corresponding names?
        let yvals = ourName.otu_ids.slice(0,10).map(mapped => `OTU ${mapped}`) // need to use a map to associate the ID with the result
        let xvals = ourName.sample_values.slice(0,10)

        let barData = [
            {
                x: xvals.reverse(),
                y: yvals.reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];
        let barLayout = {
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
        let ourNameArray = data.samples.filter(selected => selected.id == value);
        let ourName = ourNameArray[0]; // initially gives array with dictionary, so we need to select the first one

        // Same as for bar, but without the slicing or mapping
        let yvals = ourName.otu_ids
        let xvals = ourName.sample_values
        let bubbleData = [
            {
                x: yvals,
                y: xvals,
                mode: "markers",
                marker: {
                    size: ourName.sample_values,
                    color: ourName.otu_ids
                },
                text: ourName.otu_labels
            }
        ]
        let bubbleLayout = {
            title: "OTUs by Sample Value",
            margin: {t: 70, l: 75}
        }
        Plotly.newPlot("bubble", bubbleData, bubbleLayout)
    })
};

// This function gets called by init() and sets the Demographic Info box
function displayMetadata(value) {
    d3.json("samples.json").then((data) => {
        let metadataArray = data.metadata.filter(selected => selected.id == value);
        let metadata = metadataArray[0];
        console.log(metadata)
        let wordbox = d3.select("#sample-metadata");
        wordbox.html("") // resets html to be blank
        // this should work just like on the ufo assignment....
        Object.entries(metadata).forEach(([key,value]) => {
            wordbox.append("h6").text(`${key} : ${value}`)
        })
    })
}

function init () {
    let valueSelected = d3.select("#selDataset"); // Here we are selecting the dropdown button
    d3.json("samples.json").then((data) => { //use an arrow function with the then to make sure samples.json loads first
        let sampleNames = data.names; // The json file has the sample IDs called 'names' so we are grabbing them all here to display

        sampleNames.forEach((sample) => { // Using forEach to run through each of the samples and throwing the name into the dropdown menu
            valueSelected
                .append("option")
                .text(sample)
                .attr("something",sample);
        });
        makeBar(data.names[0]);
        makeBubble(data.names[0]);
        displayMetadata(data.names[0]);
    })
};

init();
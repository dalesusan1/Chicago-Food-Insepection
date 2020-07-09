
// Define variables
var risk = []
var inspectionYear = []
var result = []


// Define button
var button = d3.select("button#filter-btn");
var resetButton = d3.select("button#reset-btn")

// Define dropdown
var dropdown = d3.select("#selDataset")

// Define function to convert results into numeric
function ConvertResults (data) {
    
    if (data.Results === "Fail") {
        result.push(3)
    }
    else if (data.Results === "Pass w/ Conditions") {
        result.push(2)
    }

    else if (data.Results === "Pass") {
        result.push(1)
    }
    return result
}

// Define filterFunctions

function filterFunction (data) {
    data.map((d) => {
        name = d.AKA_name
        result = ConvertResults(d)
        risk = d.Risk
        inspectionYear.push(d.Inspection_date),
        facilityType = d.Facility_type
        totalInspections = result.length
        
    })

    // Sanity Check
    console.log(risk)
    console.log(inspectionYear)
    console.log(name)
    console.log(result)
   
    
    // Enter meta-data
    var metaData = d3.select("#sample-metadata")
    metaData.append("ul").append("h7").text(`Total Inspections | ${totalInspections}`); 
    metaData.append("ul").append("h7").text(`Facility Type |  ${facilityType}`);  
    metaData.append("ul").append("h7").text(`Risk Level |  ${risk}`); 
 

    // Defining variables for pie
    var pass = result.filter(d => d === 1).length
    var passCondition = result.filter(d => d === 2).length
    var fail =result.filter(d => d === 3).length

    // Calculating percentages
    perPass = (pass/result.length)*100;
    perPassCondition = (passCondition/result.length)*100;
    perFail = (fail/result.length)*100;
    labels = ['Pass', 'Pass w/conditions', 'Fail']

    // Sanity Check
    console.log(perPass)
    console.log(perPassCondition)
    console.log(perFail)
            
    
    // Pie
    
    var trace1 = {
        values: [perPass, perPassCondition, perFail],
        labels: labels,
        marker: {
            colors: ['rgb(151, 179, 100)', 'rgb(36, 73, 147)', 'rgb(175, 49, 35)']
            },
        type: 'pie',
        hoverinfo: 'label+percent'
    };
        
    var layout1 = {
        title: '<b> Inspection status as a percentage of the number of inspections </b>',
        height: 450,
        width: 750,
        margin: {"t": 100, "b": 10, "l": 300, "r": 0},
    };
        
    Plotly.newPlot('pie', [trace1], layout1);
    
    // Create trace
    var trace2 = {
        x: inspectionYear,
        y: result,
        type: "bar",
        marker: {
            color: 'rgb(8,48,107)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    
    var layout2 = {
        title: ` ${facilityType} | <b> ${name} </b>` ,
        xaxis: {title: "Inspection Date"},
        yaxis: {
            title: "Violations",
            range: [0,3]
        },
        font:{
            family: 'Raleway, sans-serif'
        }
    }

        // Create default plot
    Plotly.newPlot("bar", [trace2], layout2); 
}



// Read in data
d3.csv("./updated_three_years.csv").then(function (data){
    console.log(data)    

    button.on("click", handleChange);

    // creating the function handleChange
    function handleChange() {

        // prevent refreshing the page
        d3.event.preventDefault();

     
        // select input field
        var facilityInputField = d3.select("input#facility");
        var facilityInputValue = facilityInputField.property("value");
        console.log(facilityInputValue)       

        // var locationInputField = d3.select("input#location");
        // var locationInputValue = locationInputField.property("value");
        // console.log(locationInputValue)
  
        // filter data by facility using filterFunction
        var filteredFacility = data.filter(d => d.AKA_name.toLowerCase() === facilityInputValue.toLowerCase())
        filterFunction(filteredFacility)

        // filtering by location and dropping duplicates
        var filteredLocation = filteredFacility.map(d => d.Address)
        var uniqueLocation = [];
        $.each(filteredLocation, function(i, el){
            if($.inArray(el, uniqueLocation) === -1) uniqueLocation.push(el);
        });
        console.log(uniqueLocation);

        uniqueLocation.forEach(function(location) {
             dropdown.append("option").text(location).property("value");
        })  

        var value = dropdown.property("value")
        console.log(value)
    };   
})

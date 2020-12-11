let freqVis, barVis, stackedVis;

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y");
let dateParser = d3.timeParse("%m/%d/%y");



// (1) Load data with promises
let promises = [
    d3.csv("data/prepared_launch_data.csv"),
	d3.csv("data/prepared_satellite_data.csv"),
	d3.json("data/treeData.json"), //hierarchical version of launch_data
	d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
];

Promise.all(promises)
    .then( function(data){
    	// in launch data, need to assign "age" column depending on date
		// Space Age 1957-1975
		// Exploration Age 1976-2011
		// Commercialization Age 2012-Present
		// clean up data
		data[0].forEach((d, i) => {

			d.year = dateFormatter(new Date(d.Datum))
			// add age

			// clean up country info
			if (d.CompanyName=="CASC"){
				d.Country="China";
			} else if (d.CompanyName =="SRC" | d.CompanyName == "Sea Launch"){
				d.Country = "Russia";
			} else if (d.Country =="Korea"){
				d.Country = "North Korea";
			} else if (d.CompanyName =="IRGC"){
				d.Country = "Iran";
			}else if (d.Country =="Florida"){
				d.Country = "USA";
			}else if (d.Country =="California"){
				d.Country = "USA";
			}else if (d.Country =="Zealand"){
				d.Country = "New Zealand";
			}else if (d.Country =="Facility"){
				d.Country = "USA"
			}else if (d.Country =="Canaria"){
				d.Country = "USA"
			}else if (d.CompanyName =="Kosmotras"| d.CompanyName =="Land Launch"|d.CompanyName =="OKB-586"|d.CompanyName =="Roscosmos"|d.CompanyName =="RVSN USSR"|d.CompanyName =="Starsem"|d.CompanyName =="VKS RF"|d.CompanyName =="Yuzhmash"){
				d.Country = "Russia"
			}else if (d.CompanyName =="Arianespace"){
				d.Country = "France"
			}else if (d.CompanyName =="ULA"){
				d.CompanyName = "Boeing"
			} else if (d.Country == "Kazakhstan"){
				d.Country = "Russia"
			}

			// console.log(d.Date)
			if (d.year >= new Date("01/01/1957") & d.year <= new Date("12/31/1975")){
				d.age = "Space Race"
			} else if (d.year >= new Date("01/01/1976") & d.year <= new Date("12/31/2011")){
				d.age = "Exploration"
			}
			else if (d.year >= new Date("01/01/2012") & d.year <= new Date("12/31/2020")){
				d.age = "Commercialization"
			}

		})



		// clean up satellite data for orbit vis
    	data[1].forEach(d=>{
    		// console.log(d)
    		d["Apogee"]=+d["Apogee (km)"];
			d["EL"]=+d["Expected Lifetime (yrs.)"];
			d["Period"]=+d["Period (minutes)"];
			d["LaunchMass"]=+d["Launch Mass (kg.)"];
			d["Country"] = d["Country of Operator/Owner"];
			d["Owner"]= d["Operator/Owner"];
			d["Purpose2"]=d["Purpose"];
			d["Date"] = dateParser(d["Date of Launch"]);

			let str=d.Country
			// console.log(str, str.includes('/'))
			if (d.Country != "USA" & d.Country != "China" & d.Country != "United Kingdom"& d.Country != "Russia" &d.Country != "Japan" & d.Country!= d.Country.includes("/") ){
				d.Country = "Other"
			}
			if (str.includes('/')==true){
				d.Country = "Collaboration"
			}

			if (d.Purpose == "Communications" | d.Purpose == "Communications/Maritime Tracking" |d.Purpose == "Communications/Navigation" |d.Purpose == "Communications/Technology Development" ){
				d.Purpose = "Communications"
			} else if (d.Purpose == "Earth Observation" |d.Purpose == "Earth Observation/Communications" |d.Purpose == "Earth Observation/Communication/Space Science" |d.Purpose == "Earth Observation/Earth Science" |d.Purpose == "Earth Observation/Space Science" |d.Purpose == "Earth Observation/Technology Development" |d.Purpose == "Earth Science" |d.Purpose == "Earth Science/Earth Observation" |d.Purpose == "Earth/Space Observation") {
				d.Purpose = "Earth Science"
			} else if (d.Purpose == "Navigation/Global Positioning" |d.Purpose == "Navigation/Regional Positioning"){
				d.Purpose = "Navigation"
			} else if (d.Purpose == "Space Observation" |d.Purpose == "Space Science" |d.Purpose == "Space Science/Technology Demonstration" |d.Purpose == "Space Science/Technology Development"){
				d.Purpose = "Space Science"
			}
			else {
				d.Purpose = "Other"
			}

		})

		createVis(data)})
    .catch( function (err){console.log(err)} );


function createVis(data){

	// (2) Make our data look nicer and more useful
	launchData    = data[0];
	satelliteData = data[1];
	// treeData      = data[2];
	geoData       = data[3];

	// instantiate visualization objects
	freqVis = new FreqVis("freq-viz", launchData);
	barVis = new BarVis("bar-viz", launchData);
	stackedVis = new StackedVis("stacked-viz", launchData);



}


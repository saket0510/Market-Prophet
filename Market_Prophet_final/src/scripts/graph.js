function makeChart(ticker) {
	
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  d3.select("svg").remove();
  
  const centerIMG = document.getElementById("centerimg");
  
  function closeCenerImg() {
    centerIMG.style.display = "none";
  }
  closeCenerImg();

  const margin = {top: 10, right: 30, bottom: 50, left: 60},
  width = document.documentElement.clientWidth * .65 - margin.left - margin.right,
  height = document.documentElement.clientHeight * .8 - margin.top - margin.bottom;

  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
  
  

  d3.csv(`./sampleData/monthly_${ticker}.csv`,
    function(d){
        return { date : d3.timeParse("%Y-%m-%d")(d.timestamp), open : d.open,  high : d.high, low : d.low, close : d.close, pred : d.volume};
    }).then(
      function(data) {
        data = data.reverse();
        
        const x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([ 0, width ]);
        
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.high; })])
          .range([ height, 0 ]);
		  
		const zoom = d3.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [width, height]])
			.extent([[0, 0], [width, height]])
			.on("zoom", zoomed);
        
        svg.append("g") 
          .attr("transform", `translate(0, ${height})`)
          .attr("class", "x-axis")
          // .attr("transform", "rotate(-70)")
          .call(d3.axisBottom(x))
          // .attr("transform", "rotate(-70)");
        
        svg.append("g") 
        .attr("class", "y-axis")
          .call(d3.axisLeft(y));

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          // .attr("transform", "rotate(-70)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - height / 2)
          .attr("dy", ".75em")
          .text("USD");
          

		
		const dataUpTo2018 = data.filter(d => d.date.getFullYear() <= 2018);
    const dataUpTo2021 = data.filter(d => d.date.getFullYear() >= 2021);
    const specificDate = new Date("2021-02-03");  // replace with your specific date
    const dataFromSpecificDate = data.filter(d => d.date >= specificDate);
		const dataFrom2019 = data.filter(d => d.date.getFullYear() >= 2019);
		
		// Generate average data
		


		// Add the average line
		const linePath3 = svg
			.append("path")
			.datum(dataFromSpecificDate)
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "blue") // Choose a color that is distinct from the existing lines
			.attr("stroke-width", 2)
			.attr("d", d3.line()
				.x(function(d) { return x(d.date) })
				.y(function(d) { return y(d.pred) })
		);


      // Create two line paths, one green and one orange.
		const linePath1 = svg
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("stroke-width", 2)
			.attr("d", d3.line()
				.x(function(d) { return x(d.date) })
				.y(function(d) { return y(d.close) })
			);



		
        //Thu Mar 31 2016 00:00:00 GMT-0400 (Eastern Daylight Time
		
		svg
            .append("text")
            .attr("class", "title2")
            .attr("x", width / 2)
            .attr("y", 20 - margin.top / 2)
            .attr("text-anchor", "middle")
            .text(ticker + ' stock performance');

        const overlay = svg
          .append("g")
          .attr("class", "overlay")
          .style("display", "none");

        overlay
          .append("line")
          .attr("class", "x")
          .style("stroke-dasharray", "3,3")
          .attr("y2", height);

        overlay
          .append("line")
          .attr("class", "y")
          .style("stroke-dasharray", "3,3")
          // .style("background", "rgba(0,0,0,.3)")
          .attr("x2", width);
          
        overlay
          .append("circle")
          .attr("class", "y")
          .attr("r", 5);

        overlay
          .append("text")
          .attr("class", "date")
          .attr("x", width / 25)
          .attr("y", 50 - margin.top / 2)
          .style("opacity", "0.6");

        overlay
          .append("text")
          .attr("class", "open")
          .attr("x", width / 25)
          .attr("y", 70 - margin.top / 2)
          .style("background", "rgba(0,0,0,.3)")
          .style("opacity", "0.6");

        overlay
          .append("text")
          .attr("class", "high")
          .attr("x", width / 25 )
          .attr("y", 90 - margin.top / 2)
          .style("opacity", "0.6")
          // .attr("background", "rgba(0,0,0,.3)")

        overlay
          .append("text")
          .attr("class", "low")
          .attr("x", width / 25)
          .attr("y", 110 - margin.top / 2)
          .style("opacity", "0.6");

        overlay
          .append("text")
          .attr("class", "close")
          .attr("x", width / 25)
          .attr("y", 130 - margin.top / 2)
          .style("opacity", "0.6");

          overlay
    .append("text")
    .attr("class", "pred")
    .attr("x", width / 25)
    .attr("y", 190 - margin.top / 2) // adjust the y position accordingly
    .style("opacity", "0.6");

        overlay
          .append("text")
          .attr("class", "change")
          .attr("x", width / 25)
          .attr("y", (150 - margin.top / 2))
          .style("opacity", "0.6");

        overlay
          .append("text")
          .attr("class", "oChange")
          .attr("x", width / 25)
          .attr("y", 170 - margin.top / 2)
          .style("opacity","0.6");
          
        const losses = ['DIDI','GPRO','KHC','UAA', 'CTXR']

        function mouseMove(event) {
			// get the current zoom transform
			const currentTransform = d3.zoomTransform(this);

			const bsec = d3.bisector((d) => d.date).left,
			x0 = currentTransform.rescaleX(x).invert(d3.pointer(event, this)[0]),
			i = bsec(data, x0, 1),
			z1 = data[0],
			d0 = data[i],
			d1 = data[i-1],
			d = x0 - d0.date < d1.date - x0 ? d0 : d1;

		 overlay
			.select("circle.y")
			
			.attr("cx", currentTransform.applyX(x(d.date)))
			.attr("cy", currentTransform.applyY(y(d.close)))
			.style("fill","red")

		// Update the x and y position of the text elements based on the currentTransform
		 overlay
			.select(".x")
			.attr("transform", `translate(${currentTransform.applyX(x(d.date))},${currentTransform.applyY(y(d.close))})`)
			.attr("y2", height - currentTransform.applyY(y(d.close)));

		overlay
			.select(".y")
			.attr("transform", `translate(${width - currentTransform.applyX(x(d.date))},${currentTransform.applyY(y(d.close))})`)
			.attr("x2", -currentTransform.applyX(x(d.date)));

          overlay
            .select("text.date")
            .text(`Date: ${d.date.toLocaleDateString("en-US", dateOptions)}`)
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width / 6) * 4)
              } else {
                return (width / 25)
              }
            });

          overlay
            .select("text.high")
            .text(`High: $${d.high}`)
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width / 6) * 4)
              } else {
                return (width / 25)
              }
            });
          overlay
            .select("text.open")
            .text(`Open: $${d.open}`)
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width/6) * 4)
              }else {
                return (width / 25)
              }
              });
          overlay
            .select("text.close")
            .text(`Close: $${d.close}`)
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width/6) * 4)
              }else {
                return (width / 25)
              }
              });
          overlay
            .select("text.low")
            .text(`Low: $${d.low}`)
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width / 6) * 4)
              } else {
                return (width / 25)
              }
            });
       overlay
    .select("text.pred")
    .text(`pred: ${d.pred}`)
    .attr("x", () => {
      if (losses.includes(ticker)) {
        return ((width / 6) * 4)
      } else {
        return (width / 25)
      }
    });
        
          overlay
            .select("text.change")
            .text(`Daily % Change: ${((d1.close-d0.close)/d0.close * 100).toFixed(2)}%`)
            .style('fill', (color) => {
              if (`${((d1.close - d0.close) / d0.close * 100).toFixed(2)}` > 0) {
                return 'green'
              } else {
                return 'red'
              }
            })
            .attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width / 6) * 4)
              } else {
                return (width / 25)
              }
            });
          overlay
            .select("text.oChange")
            .text(`All-time % Change: ${((d.close - z1.open) / z1.open * 100).toFixed(2)}%`)
            .style('fill',(color) => {
              if (`${((d.close - z1.open) / z1.open * 100).toFixed(2)}` > 0) {
                return 'green'
              } else {
                return 'red'
              }
            }).attr("x", () => {
              if (losses.includes(ticker)) {
                return ((width / 6) * 4)
              } else {
                return (width / 25)
              }
            });
            
          overlay
            .select(".x")
            .attr("transform", `translate(${x(d.date)},${y(d.close)})`)
            .attr("yDash", height - y(d.close));

          overlay
            .select(".y")
            .attr("transform", `translate(${-(width)},${y(d.close)})`)
            .attr("x2", width + x(d.date));
        }
		function zoomed(event) {
			// create new scales based on the zoom event
			let xNewScale = event.transform.rescaleX(x);
			let yNewScale = event.transform.rescaleY(y);

			// update axes with these new boundaries
			svg.select(".x-axis").call(d3.axisBottom(xNewScale));
			svg.select(".y-axis").call(d3.axisLeft(yNewScale));

			// redraw the line using the new scales
			linePath1.attr("d", d3.line()
			.x(function (d) { return xNewScale(d.date) })
			.y(function (d) { return yNewScale(d.close)})
			);
			
			linePath3.attr("d", d3.line()
			.x(function (d) { return xNewScale(d.date) })
			.y(function (d) { return yNewScale(d.pred)})
			);
		}
        svg
          .append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("cursor","pointer")
          .style("pointer-events", "all")
		  .call(zoom)
          .on("mouseover", () => {
            overlay.style("display", "block");
          })
          .on("mouseout", () => {
            overlay.style("display", "none");
          })
          .on("touchmove mousemove", mouseMove);

          const legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 100) + "," + (height - 40) + ")");
        
        legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", "green");
        
        legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text("Close");
        
        const legend2 = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 100) + "," + (height - 20) + ")");
        
        legend2.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", "blue");
        
        legend2.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text("Prediction");
      })
	 
}

function makeSecondChart(ticker) {
  
    d3.select("svg").remove();
    const centerIMG = document.getElementById("centerimg");
    d3.select("option").remove();
    function closeCenerImg() {
      centerIMG.style.display = "none";
    }
    closeCenerImg();
    
    d3.select("#chartDropdown").style("display", "none"); // Updated line with the correct selector
  
    const margin = {top: 70, right: 30, bottom: 50, left: 60},
    width = document.documentElement.clientWidth * .45 - margin.left - margin.right,
    height = document.documentElement.clientHeight * .6 - margin.top - margin.bottom;
  
    const svg = d3.select("#container2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add title
  svg.append("text")
  .attr("x", width / 2 )
  .attr("y", 0 - (margin.top / 2))
  .style("text-anchor", "middle")
  .style("font-size", "20px")
  .text("Loss function");

  const dropdown = d3.select("#container2")
    .insert("select", "svg")
    .style("position", "absolute")
    .style("top", "70px")
    .on("change", function() {
      updateChart(this.value);
    });

  const x = d3.scaleLinear()
    .range([ 0, width ]);

  const y = d3.scaleLinear()
    .range([ height, 0 ]);

  const line = d3.line()
    .x(function(d) { return x(d.epoch); })
    .y(function(d) { return y(d.loss); });

  svg.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg.append("g")
    .attr("class", "y-axis");

  d3.csv(`./sampleData/monthly_${ticker}_loss.csv`).then(
    function(data) {
      d3.select("option").remove();

      dropdown.selectAll("option")
        .data(Object.keys(data[0]).filter(key => key !== 'epoch'))
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);
      
      updateChart(Object.keys(data[0])[1]); // Default chart to the first loss type
    });

  function updateChart(selectedLoss) {
    d3.csv(`./sampleData/monthly_${ticker}_loss.csv`,
      function(d){
          return { epoch : d.epoch, loss : d[selectedLoss]};
      }).then(
        function(data) {
          const t = d3.transition().duration(1000);// Define transition

          x.domain([0,d3.max(data, function(d) { return +d.epoch; })+1]);
          y.domain([0, d3.max(data, function(d) { return +d.loss; })]);

          // Update the x-axis
          svg.select(".x-axis")
            .transition(t)
            .call(d3.axisBottom(x));

          // Update the y-axis
          svg.select(".y-axis")
            .transition(t)
            .call(d3.axisLeft(y));

          // Update the line
          svg.select(".line")
            .datum(data)
            .transition(t)
            .attr("d", line);
        });
  }
}
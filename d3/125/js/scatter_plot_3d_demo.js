// Create a 3d scatter plot within d3 selection parent.
function scatterPlot3d(){
  var width = 2500;
  var height = 2000;
  var x3d = d3.select('#x3dScene');
      
  var scene = x3d.append("scene")
                  .attr('id','x3dScene');

  var fieldOfView = 9.8;
  scene.append("orthoviewpoint")
     .attr( "centerOfRotation", [1, 1, 1])
     .attr( "fieldOfView", [-fieldOfView, -fieldOfView, fieldOfView, fieldOfView])
     .attr( "orientation", [-1, 1, 0.1, 1.12*Math.PI/4])
     .attr( "position", [20, 7.5, 15]);

  // scene.append("background")
  //     .attr("skycolor",[0,0,0]);

  var rows = initializeDataGrid();
  var axisRange = [0,10];
  var scales = [];
  var initialDuration = 0;
  var defaultDuration = 800;
  var ease = 'linear';
  var time = 0;
  var axisKeys = ["x", "y", "z"]

  // Helper functions for initializeAxis() and drawAxis()
  function axisName( name, axisIndex ) {
    return ['x','y','z'][axisIndex] + name;
  }

  function constVecWithAxisValue( otherValue, axisValue, axisIndex ) {
    var result = [otherValue, otherValue, otherValue];
    result[axisIndex] = axisValue;
    return result;
  }

  // Used to make 2d elements visible
  function makeSolid(selection, color) {
    selection.append("appearance")
      .append("material")
         .attr("diffuseColor", color||textColor)
         .attr("shininess","2.5")
         .attr("ambientintensity","0.933")
    return selection;
  }

  // Initialize the axes lines and labels.
  function initializePlot() {
    initializeAxis(0);
    initializeAxis(1);
    initializeAxis(2);
  }

  function initializeAxis( axisIndex )
  {
    var key = axisKeys[axisIndex];
    drawAxis( axisIndex, key, initialDuration );
    var scaleMin = axisRange[0];
    var scaleMax = axisRange[1];

    if(axisIndex == 0){
        var newAxisLine = scene.append("transform")
             .attr("class", axisName("Axis1", ind))
             .attr("rotation", [0,1,0,-Math.PI/2])
             .attr("translation", scaleMax+" "+scaleMin+" "+scaleMin)
             .attr("scale", [0.3,0.3,0.3])
          .append("shape")
        newAxisLine
          .append("appearance")
          .append("material")
            .attr("emissiveColor", "gray")
        newAxisLine
          .append("polyline2d")
             // Line drawn along y axis does not render in Firefox, so draw one
             // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0");
    }else if(axisIndex == 1){
      for(var ind = 0; ind < 3; ind++){
        // the axis line
        var newAxisLine = scene.append("transform")
             .attr("class", axisName("Axis1", ind))
             .attr("rotation", ([[0,0,0,0],[0,0,1,Math.PI/2],[0,1,0,-Math.PI/2]][ind]))
             .attr("translation", scaleMin+" "+scaleMin+" "+scaleMax*xzRate)
             .attr("scale", [[1,1,1],[0.4,0.4,0.4],[0.1,0.1,0.1]][ind])
          .append("shape")
        newAxisLine
          .append("appearance")
          .append("material")
            .attr("emissiveColor", "gray")
        newAxisLine
          .append("polyline2d")
             // Line drawn along y axis does not render in Firefox, so draw one
             // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0");
      }
    }else if(axisIndex == 2){
      var xx = 0;
      for(var ind = 0; ind < (teamValues.length-1)*2; ind++){
        if(ind % 2 == 0){
          var transform = scene.append("transform")
             .attr("rotation", [0,1,0,-Math.PI/2])
             .attr("translation", (xx+scaleMax/10)+" "+scaleMin+" "+scaleMax/4)
             .attr("scale", [0.1,0.1,0.1])
          var TeamText = transform.append("billboard")
              .attr("axisOfRotation", "0 0 0")
            .append("shape")
            .call(makeSolid);
          TeamText.append("text")
            .attr("string", teamValues[parseInt(ind/2)])
            .attr("solid", "true")
            .append("fontstyle")
              .attr("quality",0)
              .attr('style','bold')
              .attr("size", 2)
              .attr("justify", "MIDDLE")
              .attr('class','teamtext');

          xx += scaleMax/(teamValues.length+1);
        }else{
          xx += scaleMax/(teamValues.length-1)/(teamValues.length+1);
        }

        var newAxisLine = scene.append("transform")
             .attr("rotation", [0,1,0,-Math.PI/2])
             .attr("translation", xx+" "+scaleMin+" "+scaleMax*xzRate)
             .attr("scale", [0.1,0.1,0.1])
          .append("shape")

        newAxisLine.append("appearance")
          .append("material")
          .attr("emissiveColor", "gray");

        newAxisLine
          .append("polyline2d")
             // Line drawn along y axis does not render in Firefox, so draw one
             // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0");
      }

      var transform = scene.append("transform")
         .attr("rotation", [0,1,0,-Math.PI/2])
         .attr("translation", (xx+scaleMax/10)+" "+scaleMin+" "+scaleMax/4)
         .attr("scale", [0.1,0.1,0.1])
      var TeamText = transform.append("billboard")
          .attr("axisOfRotation", "0 0 0")
        .append("shape")
        .call(makeSolid);
      TeamText.append("text")
        .attr("string", teamValues[parseInt(ind/2)])
        .attr("solid", "true")
        .append("fontstyle")
          .attr("quality", 0)
          .attr("size", 2)
          .attr("style","bold")
          .attr("justify", "MIDDLE");
    }
  }

  // Assign key to axis, creating or updating its ticks, grid lines, and labels.
  function drawAxis( axisIndex, key, duration ) {
    var scaleMin = axisRange[0];
    var scaleMax = axisRange[1];

    var scale = d3.scale.linear()
      .domain( [0,domainMax] ) // demo data range
      .range( axisRange )
    
    scales[axisIndex] = scale;

    var numTicks = 10;
    var tickSize = 0.1;
    var tickFontSize = 0.5;

    

    // base grid lines
    if(axisIndex == 0){
      for(var ind = 0; ind < (groupValues.length+1); ind++){
        var transform = scene.append("transform")
             .attr("rotation", [1,0.3,0,Math.PI/3*4])
             .attr("translation", scaleMax+" "+0+" "+scaleMax/15*ind)
             .attr("scale", [0.02,0.02,0.02]);
        var yTickLine = transform.append("shape")
        yTickLine
          .append("appearance")
          .append("material")
            .attr("emissiveColor", "gray")
        yTickLine
          .append("polyline2d")
             // Line drawn along y axis does not render in Firefox, so draw one
             // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0");

        if(ind < groupValues.length){
          var transform = scene.append("transform")
               .attr("rotation", [1,0.3,0,Math.PI/3*4])
               .attr("translation", scaleMax/20*21+" "+0+" "+(scaleMax/15*ind+scaleMax/30))
               .attr("scale", [0.02,0.02,0.02]);
          var yTickText = transform.append("billboard")
              .attr("axisOfRotation", "0 0 0")
            .append("shape")
            .call(makeSolid);
          yTickText.append("text")
            .attr("string", groupValues[ind])
            .attr("solid", "true")
            .append("fontstyle")
              .attr("style","bold")
              .attr("quality", 1)
              .attr("size", 10)
              .attr("justify", "MIDDLE");
        }
      }
    }else if (axisIndex==1) {
      for(var ind = 0; ind < numTicks+1; ind++){
        var transform = scene.append("transform")
             .attr("rotation", [0,1,0,Math.PI/9*10])
             .attr("translation", 0+" "+scaleMax*xzRate*2/numTicks*ind+" "+scaleMax*xzRate)
             .attr("scale", [0.02,0.02,0.02]);
        var yTickLine = transform.append("shape")
        yTickLine
          .append("appearance")
          .append("material")
            .attr("emissiveColor", "gray")
        yTickLine
          .append("polyline2d")
             // Line drawn along y axis does not render in Firefox, so draw one
             // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0");

        var transform = scene.append("transform")
             .attr("rotation", [0,1,0,Math.PI/9*10])
             .attr("translation", -scaleMax/30+" "+(scaleMax*xzRate*2/numTicks*ind-scaleMax/60)+" "+scaleMax*xzRate)
             .attr("scale", [0.02,0.02,0.02]);
        var yTickText = transform.append("billboard")
            .attr("axisOfRotation", "0 0 0")
          .append("shape")
          .call(makeSolid)
        yTickText.append("text")
          .attr("string", parseInt(ind/domainMax*100*numTicks)+"%")
          .append("fontstyle")
            .attr("size", 10)
            .attr('quality',2)
            .attr('style','bold')
            .attr("justify", "END")
      }

      var ticks12 = scale.ticks( numTicks );
      for(var i=0; i < ticks12.length; i++){
        ticks12[i] = ticks12[i]*2*xzRate;
      }

      var gridLines = scene.selectAll( "."+axisName("GridLine1", axisIndex))
         .data(ticks12);
      gridLines.exit().remove();
      
      var newGridLines = gridLines.enter()
        .append("transform")
          .attr("class", axisName("GridLine1", axisIndex))
          .attr("rotation", [1,0,0, -Math.PI/2])
        .append("shape")

      newGridLines.append("appearance")
        .append("material")
          .attr("emissiveColor", "gray")
      newGridLines.append("polyline2d");

      gridLines.selectAll("shape polyline2d").transition().duration(duration)
        .attr("lineSegments", "0 0, " + axisRange[1] + " 0")

      gridLines.transition().duration(duration)
         .attr("translation", function(d) {
            return "0 "+scale(d) + " 0"; 
          })

      var gridLines = scene.selectAll( "."+axisName("GridLine2", axisIndex))
         .data(ticks12);
      gridLines.exit().remove();
      var newGridLines = gridLines.enter()
        .append("transform")
          .attr("class", axisName("GridLine2", axisIndex))
          .attr("rotation", [0,1,0, -Math.PI/2])
          .attr("scale",[0.2,0.2,0.2])
        .append("shape")

      newGridLines.append("appearance")
        .append("material")
          .attr("emissiveColor", "gray")
      newGridLines.append("polyline2d");

      gridLines.selectAll("shape polyline2d").transition().duration(duration)
        .attr("lineSegments", "0 0, " + axisRange[1] + " 0")

      gridLines.transition().duration(duration)
         .attr("translation", function(d) {
            return "0 "+scale(d) + " 0"; 
          })
    }  
  }

  // Update the data points (spheres) and stems.
  function plotData( duration ) {
    
    if (!rows) {
     console.log("no rows to plot.")
     return;
    }


    var scaleMin = axisRange[0];
    var scaleMax = axisRange[1];

    var x = scales[0], y = scales[1], z = scales[2];
    var sphereRadius = cylinderRadius;

    // Draw a sphere at each x,y,z coordinate.
    var datapoints = scene.selectAll(".datapoint").data( rows );
    datapoints.exit().remove()

    var newDatapoints = datapoints.enter()
      .append("transform")
        .attr("class", "datapoint")
        .attr("scale", function(d){
          // console.log(d.yRadius);
          return [sphereRadius, d.yRadius, sphereRadius]
        })
      .append("shape");
    newDatapoints
      .append("appearance")
      .append("material");
    newDatapoints
      .append("cylinder")
      .attr("teamValue",function(d){
        return d.teamValue;
      })
      .attr("groupValue",function(d){
        return d.groupValue;
      })
      .attr("choices",function(d){
        return d.choices;
      })
      .attr("onmouseover", "handleSingleMouseOver(this, event)")
      .attr("onmouseout", "handleSingleMouseOut(this)");
       // Does not work on Chrome; use transform instead
       //.attr("radius", sphereRadius)

    datapoints.selectAll("shape appearance material")
        .attr("diffuseColor", function(d){
          return d.color;
        });

    datapoints.transition().ease(ease).duration(duration)
        .attr("translation", function(row) { 
          return x(row[axisKeys[0]]) + " " + y(row[axisKeys[1]]) + " " + z(row[axisKeys[2]])});
  }

  function initializeDataGrid() {
    var rows = [];
    var xDelta1 = (domainMax/(teamValues.length+1)-domainMax/(teamValues.length+1)*cylinderRadius*choiceValues.length)/(choiceValues.length+1);
    var xDelta2 = domainMax/(teamValues.length+1)/(teamValues.length-1);
    var cylinderR = domainMax*xzRate*cylinderRadius;
    var zDelta1 = (domainMax*xzRate-cylinderR*groupValues.length)/(groupValues.length+1);
    var xx = cylinderR/2, xxx;
    for(var x = 0; x < teamValues.length; x++){
      for(var z = 0; z < groupValues.length; z++){
        xxx = xx;
        xxx += xDelta1;
        for(var ch = 0; ch < choiceValues.length; ch++){
          var yRadius = yHeight[x*(teamValues.length-1)+z][ch]/domainMax*2;
          var yy = yRadius*domainMax/10;
          var str = "";
          for(t = 0; t < choiceValues.length; t++){
            var ytRadius = yHeight[x*(teamValues.length-1)+z][t]/domainMax*2;
            str += choiceValues[t]+": "+Math.round(ytRadius*50)+"% ("+yValues[x*(teamValues.length-1)+z][ch]+")";
            if(t < choiceValues.length-1) str += ",";
          }
          rows.push({x: xxx, y: yy, z: zDelta1+z*xDelta2+cylinderR/2 , color: ChoiceColors[ch], yRadius: yRadius
                    , teamValue: teamValues[x], groupValue: groupValues[z], choices: str});
          xxx += xDelta1+cylinderR;
        }
        xxx += xDelta2;
      }
      xx = xxx;
    }
    return rows;
  }

  function updateData() {
    time += Math.PI/8;
      for (var r=0; r<rows.length; r++) {
        var x = rows[r].x;
        var z = rows[r].z;
        // rows[r].y++;
        rows[r].yRadius+= 0.1;
      }
      plotData( defaultDuration );
  }

  initializeDataGrid();
  initializePlot();
  plotData( defaultDuration );
  // setInterval( updateData, defaultDuration );
}

function invertMousePosition(evt) 
{
  var convertPoint = window.webkitConvertPointFromPageToNode;
  var pageX = -1, pageY = -1;
  if ( "getBoundingClientRect" in document.documentElement ) {
    var elem = d3.select('#divX3d').node();
    console.log('elem:', elem)
    var box = elem.getBoundingClientRect();
    var scrolleft =  window.pageXOffset || document.body.scrollLeft;
    var scrolltop =  window.pageYOffset || document.body.scrollTop;
    var paddingLeft = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('padding-left'));
    var borderLeftWidth = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('border-left-width'));
    var paddingTop = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('padding-top'));
    var borderTopWidth = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('border-top-width'));
    pageX = Math.round(evt.layerX + (box.left + paddingLeft + borderLeftWidth + scrolleft));
    pageY = Math.round(evt.layerY + (box.top + paddingTop + borderTopWidth + scrolltop));
  } else if (convertPoint) {
    var pagePoint = convertPoint(evt.target, new WebKitPoint(0, 0));
    x = Math.round(point.x);
    y = Math.round(point.y);
  } else {
    x3dom.debug.logError('NO getBoundingClientRect, NO webkitConvertPointFromPageToNode');
  }
  return { x: pageX, y: pageY };
}

function drawLegend(){
  var width = $('#legend').width();
  var height = $('#legend').height()/3*choiceValues.length;
  var svg = d3.select('#legend')
              .append("svg")
              .attr("width",width)
              .attr("height",height)
            .append("g")
              .attr("transfrom","translate(0,0)");
  svg.append('rect')
    .attr('width',width)
    .attr('height',height)
    .attr('fill','white')
    .attr('stroke','black')
    .attr('stroke-width',2);
  var offset = width/14;
  var fontSize = offset*1.5;
  var rectWidth = width/148*68;
  var rectHeight = fontSize/20*19;
  svg.append('text')
    .attr('x',width/2-offset)
    .attr('y',offset+fontSize/2)
    .attr('z',offset+fontSize/2)
    .attr('text-anchor','middle')
    .attr('font-size',fontSize)
    .text('Choice');
  var y = offset/2*3+fontSize;
  var x = width/2-offset/2;
  for(var i = 0; i < choiceValues.length; i++){
    var color = ChoiceColors[i];
    svg.append('rect')
      .attr('x',x)
      .attr('y',y+(fontSize+offset)*i)
      .attr('width',rectWidth)
      .attr('height',rectHeight)
      .attr('fill',color)
      .attr('stroke','black');
    svg.append('text')
      .attr('x',x-width/168*10)
      .attr('y',y+(fontSize+offset)*i+fontSize/3*2)
      .attr('font-size',fontSize)
      .text(choiceValues[i])
      .attr('text-anchor','end');
  }
}
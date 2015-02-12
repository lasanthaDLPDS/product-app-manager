
$(function () {
    drawGraphs();
});

function drawGraphs() {

    var url = window.location.pathname;
    var comps = url.split('/');
    var type = comps[comps.length - 2];
    var operation = comps[comps.length - 3];
    var action = 'getSubscriberCountByAPIs';
    var dateRange = $('#date-range').val();
    var from = dateRange.split('to')[0].trim()+":00";
    var to = dateRange.split('to')[1].trim()+":00";

    $.ajax({
        async : false,
        url : '/publisher/api/assets/' + operation + '/' + type
            + '/getAPIUsageByUser/',
        type : 'POST',
        data : {
            'startDate' : from,
            'endDate' : to
        },
        success : function(response) {
            drawAPIUsageByUser(response);
        },
        error : function(response) {
            alert('Error occured at statistics graph rendering');
        }
    });

}

var drawAPIUsageByUser = function(response) {

    var parsedResponse = JSON.parse(response);

   // var parsedResponse = [["Travel Claims", [["1", [["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"],["admin", "2"]]]]], ["Net Usage Analyser", [["1", [["admin", "30"]]]]], ["Leave Managment", [["1", [["admin", "30"]]]]], ["pizza", [["1", [["test", "29"]]]]], ["Travel Booking", [["1", [["admin", "29"]]]]], ["webappsample", [["1", [["test", "27"]]]]], ["sample", [["1", [["admin", "20"], ["test", "19"]]]]], ["Hardware Repo", [["1", [["admin", "18"]]]]], ["MyApp", [["1", [["test", "14"]]],["2", [["test", "14"]]]]]]
    length=parsedResponse.length;
    $("#tooltipTable").find("tr:gt(0)").remove();
    var data = [];
    for ( var i = 0; i < parsedResponse.length; i++) {

        var statement = '';
        var count = 0;
        var app ='';

		for ( var j = 0; j < parsedResponse[i][1].length; j++) {
            app =(parsedResponse[i][0]);
            //remove white spaces in app name
            app = app.replace(/\s+/g, '');

            if (j != 0) {
                statement = statement + '<tr>'
            }

            var maximumUsers = parsedResponse[i][1][j][1].length;
           // origLen=parsedResponse[i][1][j][1];





 var newArr = [],
                                  origLen = parsedResponse[i][1][j][1].length,
                                  found, x, y;
            maxrowspan = parsedResponse[i][1][j][1].length;
            allcount = 0;
 //alert(parsedResponse[i][1][j][1])
            for ( var k = 0; k < maximumUsers; k++) {


                                found = undefined;
                                for (y = 0; y < newArr.length; y++) {
                                    //alert(origArr[x][0])
                                    if (parsedResponse[i][1][j][1][k][0] === newArr[y]) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    newArr.push(parsedResponse[i][1][j][1][k][0]);
                                }

                            //alert(newArr)

                count++;
                allcount = Number(allcount)+Number(parsedResponse[i][1][j][1][k][1]);

            }
            data.push({
                API_name:app,
                Subscriber_Count:newArr.length,
                Hits:allcount,
                API:app
            });
		}
	}
    var svg = dimple.newSvg(".graph-container", 1000, 700);
    chart = new dimple.chart(svg, data);
    chart.setBounds("10%", "10%", "75%", "60%");
    x = chart.addCategoryAxis("x", "API");

    y = chart.addMeasureAxis("y", "Subscriber_Count");
    y.title = "Subscriber Count";
    y.tickFormat = '1d';

    z = chart.addMeasureAxis("z", "Hits");
    s = chart.addSeries("API", dimple.plot.bubble);
    var div = d3.select("body").append("div").attr("class", "toolTip");



    //new code
    var filterValues = dimple.getUniqueValues(data, "API");

    var $dataTable =$('<table class="display" width="100%" cellspacing="0" id="apiSelectTable"></table>');

    $dataTable.append($('<thead class="tableHead"><tr>'+
                            '<th width="10%"></th>'+
                            '<th>API</th>'+
                        '</tr></thead>'));
    for(var n=0;n<filterValues.length;n++){

       /*if(n<2){
            $dataTable.append($('<tr><td >'
                                 +'<input name="item_checkbox'+n+'" onchange="myFunction(this);" checked   id='+n+'  type="checkbox"  data-item='+filterValues[n] +' class="ccf"/>'
                                 +'</td>'
                                 +'<td style="text-align:left;"><label for='+n+'>'+filterValues[n] +'</label></td></tr>'));
        }else{
        $dataTable.append($('<tr><td >'
                                 +'<input name="item_checkbox'+n+'" onchange="myFunction(this);"  id='+n+'  type="checkbox"  data-item='+filterValues[n] +' class="ccf"/>'
                                 +'</td>'
                                 +'<td style="text-align:left;"><label for='+n+'>'+filterValues[n] +'</label></td></tr>'));
        }*/

        $dataTable.append($('<tr><td >'
                                +'<input name="item_checkbox'+n+'" onchange="myFunction(this);" checked   id='+n+'  type="checkbox"  data-item='+filterValues[n] +' class="ccf"/>'
                                +'</td>'
                                +'<td style="text-align:left;"><label for='+n+'>'+filterValues[n] +'</label></td></tr>'));

     }

                    if (length == 0) {
//                        $('.graph-container').html($('<span class="label label-info">No Data available</span>'));

                    } else {

                        $('#tableContainer').append($dataTable);
                        $('#tableContainer').show();
                        $('#apiSelectTable').DataTable({
                            retrieve: true,
                            "order": [[ 1, "asc" ]],
                            "aoColumns": [
                            { "bSortable": false },
                            null
                            ],

                        });


                        $('#apiSelectTable').on( 'change', 'input.ccf', function () {
                                  var id =  $(this).attr('value');
                                  var check=$(this).is(':checked');
                                  var temp= $(this).attr('data-item');

                                  // This indicates whether the item is already visible or not
                                  var hide = false;
                                  var newFilters = [];

                                     filterValues.forEach(function (f){
                                             if(f==temp){
                                                 hide = true;
                                             }
                                             else{
                                                 newFilters.push(f);
                                             }
                                     });
                                     if (hide) {
                                     } else {
                                               newFilters.push(temp);
                                     }
                                             filterValues = newFilters;
                                             chart.data = dimple.filterData(data, "API", filterValues);
                                             chart.draw();
                        } );
                    }


    s.afterDraw = function (shp, d) {
        var shape = d3.select(shp);
        var circle=d3.select("#"+d.aggField+"_"+d.aggField+"__");

        circle.on("click", function(d){
             for ( var i = 0; i < parsedResponse.length; i++) {
                var count = 0;
                var app ='';

                if(d.aggField == (parsedResponse[i][0]).replace(/\s+/g, '')){
                    var arr=[];


                    for ( var j = 0; j < parsedResponse[i][1].length; j++) {
                        app =(parsedResponse[i][0]);

                        if (j != 0) {
                        }

                        var maximumUsers = parsedResponse[i][1][j][1].length;
                        maxrowspan = parsedResponse[i][1][j][1].length;
                        allcount = 0;
                        for ( var k = 0; k < maximumUsers; k++) {
                            if (k != 0) {
                            }
                            count++;
                            allcount = Number(allcount)+Number(parsedResponse[i][1][j][1][k][1]);

                        }
                         arr.push({version:parsedResponse[i][1][j][0],count:allcount});

                    }

                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    var chartid= "chart"+k;

                    div.html('<table class="table graphTable" id="tooltipTable" ><thead><tr><th>version</th><th>Hits</th></tr></thead><tbody></tbody></table>');

                    for (var l=0;l<arr.length;l++){
                        var arrStr=JSON.stringify(arr);
                        var versionName=arr[l].version;
                        var versionCount=arr[l].count;
                        $('#tooltipTable tbody').append('<tr><td>'+versionName+'</td><td>'+versionCount+'</td></tr>');

                    }

                }

            }

        });
        circle.on("mouseout", function(d){
          div.style("display", "none");
        });

    };
    chart.draw();

//     chart.legends = [];
//
//            // This block simply adds the legend title. I put it into a d3 data
//            // object to split it onto 2 lines.  This technique works with any
//            // number of lines, it isn't dimple specific.
//            svg.selectAll("title_text")
//              .data(["Click legend to","show/hide Apps:"])
//              .enter()
//              .append("text")
//                .attr("x", 499)
//                .attr("y", function (d, i) { return 80 + i * 14; })
//                .style("font-family", "sans-serif")
//                .style("font-size", "10px")
//                .style("color", "Black")
//                .text(function (d) { return d; });
//
//            // Get a unique list of Owner values to use when filtering
//            var filterValues = dimple.getUniqueValues(data, "API");
//            //alert(filterValues)
//
//
//
//     myLegend.shapes.selectAll("rect").on("click", function (e) {
//                // This indicates whether the item is already visible or not
//                var hide = false;
//                var newFilters = [];
//                // If the filters contain the clicked shape hide it
//                filterValues.forEach(function (f) {
//                  if (f === e.aggField.slice(-1)[0]) {
//                    //alert(e.aggField.slice(-1)[0]);
//                    hide = true;
//                  } else {
//                    //alert(e.aggField.slice(-1)[0]);
//                    newFilters.push(f);
//                  }
//                });
//                // Hide the shape or show it
//                if (hide) {
//                  d3.select(this).style("opacity", 0.2);
//                } else {
//                  newFilters.push(e.aggField.slice(-1)[0]);
//                  d3.select(this).style("opacity", 0.8);
//                }
//                // Update the filters
//                filterValues = newFilters;
//                // Filter the data
//       //alert(JSON.stringify(newFilters));
//               chart.data = dimple.filterData(data, "API", filterValues);
//                // Passing a duration parameter makes the chart animate. Without
//                // it there is no transition
//                chart.draw(800);
//               });

}

var onDateSelected = function() {
    $('.graph-container').empty();
    drawGraphs();
    data = [];
}

function clearTables() {
    $('#tbody').empty();
    $('.chartContainer').remove();

}


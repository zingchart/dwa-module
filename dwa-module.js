zingchart.defineModule('dwa', 'plugin', function(json){
    /* Checks to see if all values in an array are equal. */
    Array.prototype.allValuesSame = function() {
        for(var i = 1; i < this.length; i++){
            if(this[i] !== this[0]){
                return false;
            }
        }
        return true;
    };

    var numSeries = json.series.length; // The number of series in the chart.
    var numValues = []; // Will hold the number of values in each series.
    var weights = []; // Will hold the weights for each series.

    /*
     * Get the number of values in each series to make sure there are the same #.
     * Also, get the weights if they are available. If no weights are available,
     * the normal average will be taken.
     */
    for (var n = 0; n < numSeries; n++){
        numValues.push(json.series[n].values.length);
        weights.push(json.series[n].weight ? json.series[n].weight : 1/numSeries);
    }

    /*
     * Here, we use the allValuesSame prototype method to make sure there are
     * the same number of values in each series. If there is a different
     * number of values in a series, return the (as-of-yet) unmodified json object.
     */
    if(!numValues.allValuesSame()){
        console.log("Each series need to be of the same length!");
        return json;
    }

    /* Parse the options. */
    var seriesName = json.dwa.name ? json.dwa.name : "Weighted Average";
    var visibleAtFirst = !json.dwa.visibleAtFirst ? json.dwa.visibleAtFirst : true;

    /* Calculate the average between all series.  */
    var dwaValues = [];
    var sumAtIndex = null;
    for (n = 0; n < numValues[0]; n++){
        sumAtIndex = 0;
        for (var i = 0; i < numSeries; i++){
            sumAtIndex += json.series[i].values[n] * weights[i];
        }
        dwaValues.push(sumAtIndex);
    }

    /* Push the new DWA series. */
    json.series.push({
        values: dwaValues,
        text: seriesName,
        visible: visibleAtFirst
    });

    /* Return the modified JSON, which has the new DWA series. */
    return json;
});
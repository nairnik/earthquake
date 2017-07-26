(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "time", alias : "time", dataType : tableau.dataTypeEnum.datetime },
        { id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
        { id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
        { id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
        { id : "lat", alias : "latitude", columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
        { id : "lon", alias : "longitude",columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
        { id : "place", alias : "place", dataType : tableau.dataTypeEnum.string }
    ];

    var tableInfo = {
        id : "earthquakeFeed",
        alias : "Hourly Updates of Earthquakes",
        columns : cols
    };

    schemaCallback([tableInfo]);
};

   myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "id": feat[i].id,
                "time": feat[i].properties.time,
                "mag": feat[i].properties.mag,
                "title": feat[i].properties.title,
                "lon": feat[i].geometry.coordinates[0],
                "lat": feat[i].geometry.coordinates[1],
                "place": feat[i].properties.place
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});
})();

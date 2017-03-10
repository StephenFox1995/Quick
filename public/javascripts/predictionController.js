angular
  .module('prediction')
  .controller('PredictionController', PredictionController);

PredictionController.inject = ['$scope', 'predictionService', 'VisDataSet', 'sessionService']
function PredictionController($scope, predictionService, VisDataSet, sessionService) {
  $scope.businessName = sessionService.getClientName();
  var names = ['Expected orders', 'Actual orders', 'Max Employees', 'Max Employees'];
  var ordersGroups = new vis.DataSet();
  ordersGroups.add({
    id: "Expected Orders",
    content: names[0],
    options: {
      drawPoints: {
        style: 'square' // square, circle
      },
      shaded: {
        orientation: 'bottom' // top, bottom
      }
    }
  });
  ordersGroups.add({
    id: "Actual Orders",
    content: names[1],
    options: {
      drawPoints: {
        style: 'square' // square, circle
       },
       shaded: {
         orientation: 'bottom' // top, bottom
       }
     }
  });

  (() => {
    predictionService.orderPredictionDataForBusiness()
      .then(data => {
        const graphData = 
          predictionService.transformOrderPredictionData(data.data.predictions.data);
        
        $scope.data1 = { items: new vis.DataSet(graphData) };
        $scope.options1 = {
          style: "line",
          drawPoints: true,
          legend: { left: { position: "top-left" } },
          start: graphData[0].x,
          end: graphData[graphData.length - 1].x,
        };
        $scope.$apply();
      });
     predictionService.employeePredictionDataForBusiness()
      .then(data => {
        const graphData = 
          predictionService.transformPredictionData(data.data.predictions.data);
        
        $scope.data2 = { items: new vis.DataSet(graphData) };
        $scope.options2 = {
          style: 'bar',
          barChart: { width: 500, align:'right', sideBySide:true },
          drawPoints: false,
          legend: { left: { position: "top-left" } },
          start: graphData[0].x,
          end: graphData[graphData.length - 1].x,
        };
        $scope.$apply();
      });
  })();
}
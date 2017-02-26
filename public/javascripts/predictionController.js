angular
  .module('prediction')
  .controller('PredictionController', PredictionController);

PredictionController.inject = ['$scope', 'predictionService', 'VisDataSet', 'sessionService']
function PredictionController($scope, predictionService, VisDataSet, sessionService) {
  $scope.businessName = sessionService.getClientName();
  (() => {
    predictionService.orderPredictionDataForBusiness()
      .then(data => {
        const graphData = 
          predictionService.transformPredictionData(data.data.predictions.data);
        
        $scope.data = { items: new vis.DataSet(graphData) };
        $scope.options = {
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
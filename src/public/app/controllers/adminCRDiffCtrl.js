angular.module('apolloApp').controller('adminCRDiffCtrl', ['$scope', '$http','$routeParams','$filter','nodeAttributeDictionary',
	function($scope,$http,$routeParams,$filter,nodeAttributeDictionary) {

        $scope.crDiffValues = [];
        var mongoid=$routeParams.id;
        console.log(mongoid);

        $scope.actAttributes = {};
        for (x in nodeAttributeDictionary) {
            //console.log("***********************"+x);
            $scope.actAttributes[x] = [];
            for (y in nodeAttributeDictionary[x].attributeGroups) {
                for (z in nodeAttributeDictionary[x].attributeGroups[y].attributes) {
                    $scope.actAttributes[x].push("" + z + "");
                    //for getting attribute names 
                    // var attname=$filter('unCamelCase')(z);
                    // console.log("x="+x+", z=" + attname + ", des="+nodeAttributeDictionary[x].attributeGroups[y].attributes[z].description);
                }
            } //$scope.nodeattributes.x
        }


        $http.get('/apollo/api/mongo/'+mongoid).then(function(res) {
            $scope.mongoData=res.data;
            console.log($scope.mongoData);
            
            $scope.nodeId=$scope.mongoData[0].id;
            $scope.nodeType=$scope.mongoData[0].CR_NODE_TYPE;
            $scope.nodeName=$scope.mongoData[0].name;
            $scope.crRequestType=$scope.mongoData[0].CR_REQUEST_TYPE;
            $scope.crStatus=$scope.mongoData[0].CR_STATUS;
            $scope.crNodeType=$scope.mongoData[0].CR_NODE_TYPE;
            $scope.crDate=$scope.mongoData[0].CR_DATE;
            $scope.crUser=$scope.mongoData[0].CR_USER;


            $http.get('/apollo/api/node/' + $scope.nodeId).then(function(res) {
                console.log(res.data);
                $scope.nodeData = res.data;


                
                $scope.nodeDictionaryAttributes=$scope.actAttributes[$scope.nodeType];
                
                $scope.nodeDictionaryAttributes.forEach(function(d){
                    for(na in $scope.nodeData.attributes)
                    {
                        var key = $scope.nodeData.attributes[na].key;

                        var valueOld = $scope.nodeData.attributes[na].value;
                        var valueNew = $scope.mongoData[0][d];
                        var diffFlg=false;
                        if(key==d)
                        {
                            //console.log(value);
                            var diff=diffString(valueOld,valueNew);
                            //console.log(diff);
                            
                            if(diff.indexOf("<ins>")>-1)
                            {
                                diffFlg=true;
                            }
                            if(diff.indexOf("<del>")>-1)
                            {
                                diffFlg=true;
                            }
                            $scope.crDiffValues.push({"key":$filter("unCamelCase")(key),"valueOld":valueOld,"valueNew":valueNew,"diff":diff,"diffFlg":diffFlg})
                            //$scope.cr[key]=value;

                        }
                    }

                        //console.log(d, nodeData.attributes);
                });

               console.log($scope.crDiffValues); 

            });
        });

        
        



}]);


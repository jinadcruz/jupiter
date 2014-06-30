angular.module('apolloApp').controller('rootCtrl', function($scope, $http, $location, localStorageService, $modal){
    
    $scope.q = 'home';
    $scope.loginuser = 'guest';
    $scope.queryString = '';

    $http.get('build.json')
      .then(function(res){
      	
      	var build = res.data
         $scope.buildNumber = res.data.buildNumber;              
       });
    
    $scope.toCapitalizedWords  = function toCapitalizedWords(name) {
      //var words = name.match(/[A-Za-z][a-z]*/g);
      var words = name.match(/^[a-z]+|[A-Z][a-z]*/g);
      return words.map(capitalize).join(" ");
    };

    function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    }

    $scope.redirectToSearch = function(){
       window.location =  '/apollo/#/search/' + $scope.queryString;
    };

    $scope.itemSelected = function($item, $model, $label) {
        window.location =  '/apollo/#/node/' + $item.id;
        $scope.queryString = null;
    };

    $scope.getNodes = function(val) {
        return $http.get('/apollo/api/node/searchByName/' + val).then(function(res) {
            var nodes = [];
            angular.forEach(res.data, function(item) {
                nodes.push(item);
            });
            return nodes;
        });
    };

    $scope.showSidebar = true;

    $scope.getSidebarWidth = function(){

       // returning the column width for the sidebar
       if ($scope.showSidebar == true) {
          return 'col-lg-1 col-md-1 col-sm-1';
       }
       else if ($scope.showSidebar == false) {
         return 'col-lg-2 col-md-2 col-sm-2';
       };

    }

    $scope.getContentWidth = function(){

       // returning the column width for the sidebar
       if ($scope.showSidebar == true) {
          return 'col-lg-11 col-md-11 col-sm-11';
       }
       else if ($scope.showSidebar == false) {
          return 'col-lg-10 col-md-10 col-sm-10';
       };
    }

    $scope.toggleSidebar = function(){
      $scope.showSidebar = !$scope.showSidebar;
    };


    //SITE HISTORY


    $scope.browseHistory = {
       'sites':
       [
       ]
     }

      if (localStorageService.get('browseHistory') != null)
    {
      //console.log('browsehistory pull succeeded.  It was: ' + $cookies.browseHistory);
      try
      {
        var browseHistoryJson = angular.fromJson(localStorageService.get('browseHistory'));
        if (browseHistoryJson.sites != null && browseHistoryJson.sites[0] != null)
        {
          $scope.browseHistory = browseHistoryJson;
        }
      } catch(e)
      {console.log ('BrowseHistory LocalStorage/cookie unparsable, error given was ' + e)}
    }

    // if ($cookies.browseHistory != null)
    // {
    //   //console.log('browsehistory pull succeeded.  It was: ' + $cookies.browseHistory);
    //   try
    //   {
    //     var browseHistoryJson = angular.fromJson($cookies.browseHistory);
    //     if (browseHistoryJson.sites != null && browseHistoryJson.sites[0] != null)
    //     {
    //       $scope.browseHistory = browseHistoryJson;
    //     }
    //   } catch(e)
    //   {console.log ('BrowseHistory cookie unparsable, error given was ' + e)}
    // }

    

    $scope.unshiftSiteHistory = function unshiftSiteHistory(node){
      //check scope history for node
      var foundMatch = false;
      for (var i=0; i<$scope.browseHistory.sites.length; i++)
      {
        if(node.name == $scope.browseHistory.sites[i].name)
        {
          arraymove($scope.browseHistory.sites, i, 0);
          // console.log ('found a match in the unshift site thingy');
          foundMatch=true;
        }
      }
      if(!foundMatch)
      {
        $scope.browseHistory.sites.unshift(node);
        if ($scope.browseHistory.sites.length >30)
        {
          $scope.browseHistory.sites = $scope.browseHistory.sites.slice(0,29);
        }
      }
      //$cookies.browseHistory = angular.toJson($scope.browseHistory)
      localStorageService.set('browseHistory', angular.toJson($scope.browseHistory))
      //console.log('Just saved browse history as ' + angular.toJson($scope.browseHistory))
    }

    function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex]
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

    //TWITTER CONNECT

    $scope.twitterRootBlurb = encodeURIComponent($location.absUrl());

    
    // FACEBOOK CONNECT
    $scope.facebook_appID = '';
    $scope.app_domain = '';
    $scope.app_description = 'The CDC Integrated Surveillance Portal (CISP) is a comprehensive, real-time, interactive resource for CDC, its partners, and the public to explore and discover information about the full inventory of CDC’s Surveillance Systems, Programs, Registries, Health Surveys, Tools, and Collaboratives. CISP contains not only descriptive information about these CDC resources — CISP also describes the relationships between resources.';
    $scope.app_image = '';
    window.fbAsyncInit = function() {
      
      if(window.location.hostname == 'localhost'){
        $scope.facebook_appID = '1429109474024840';
        $scope.app_domain = 'localhost:8089/apollo/';
        $scope.app_image = 'http://edemo.phiresearchlab.org/apollo/img/header_graphic_alpha.png';
      }
      else if(window.location.hostname == 'edemo.phiresearchlab.org'){
        $scope.facebook_appID = '1501295270085876';
        $scope.app_domain = 'edemo.phiresearchlab.org/apollo/';
        $scope.app_image = 'http://edemo.phiresearchlab.org/apollo/img/header_graphic_alpha.png';
      }
      else if(window.location.hostname == 'cloudev.phiresearchlab.org'){
        $scope.facebook_appID = '669609933094570';
        $scope.app_domain = 'cloudev.phiresearchlab.org/apollo/';
        $scope.app_image = 'http://cloudev.phiresearchlab.org/apollo/img/header_graphic_alpha.png';
      }

      FB.init({appId: $scope.facebook_appID, status: true, cookie: true,
      xfbml: true});
    };
    
    (function() {
      var e = document.createElement('script'); e.async = true;
      e.src = document.location.protocol +
      '//connect.facebook.net/en_US/all.js';
      document.getElementById('fb-root').appendChild(e);
    }());

    //START Facebook Share - Sample Post
    $scope.foodbornePost = {id:1, title:"Foodborne Illness Surveillance, Response and Data Systems", app_sublink:"/#/quickGuide/foodBorneIllness", caption:"", content:"The CDC Integrated Surveillance Portal (CISP) is a comprehensive, real-time, interactive resource for CDC, its partners, and the public to explore and discover information about the full inventory of CDC’s Surveillance Systems, Programs, Registries, Health Surveys, Tools, and Collaboratives. CISP contains not only descriptive information about these CDC resources"};
     
    $scope.share = function(post){
      FB.ui(
      {
          method: 'feed',
          name: post[0],
          link: $scope.app_domain+post[1],
          picture: $scope.app_image,
          caption: '',
          description: 'About CISP: '+$scope.app_description,
          message: ''
      });
  }
  //END Facebook Share

  //Displaying the Disclaimer Modal Dialog
  $scope.showDisclaimer = true;
  // $cookieStore.put('disclaimerAcceptStatus', $scope.showDisclaimer);
  localStorageService.set('disclaimerAcceptStatus', $scope.showDisclaimer);

  $scope.open = function(size){

    if($scope.showDisclaimer){

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: size,
        resolve: {
          showDisclaimer: function () {
            return $scope.showDisclaimer;
          }
        }
      });

    modalInstance.result.then(function (disclaimerVal) {
        // console.log("After the modal is closed ::"+disclaimerVal);
        $scope.showDisclaimer = disclaimerVal;
        // console.log("The scope.showDisclaimer value is ::"+$scope.showDisclaimer);
    });
    
    };

  } 

});

var ModalInstanceCtrl = function ($scope, $modalInstance, showDisclaimer) {

  $scope.disclaimerVal = showDisclaimer;

  $scope.resetCheckbox = function($event){
    $scope.disclaimerVal = !$scope.disclaimerVal;
  }  

  $scope.ok = function () {
    $modalInstance.close($scope.disclaimerVal);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
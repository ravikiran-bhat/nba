module.exports = [
  'referenceObjectsSuggestionService',
  function(suggestionService) {
  var isWaiting = false;
    var searchData = null;

    function myFilter(input) {

        var translationValue = "Loading...";
        if(searchData){
            return searchData;
        }else {
            if(isWaiting === false) {
                isWaiting = true;
                translationService.getTranslation(input).then(function(translationData) {
                    console.log("GetTranslation done");
                    searchData = translationData;
                    isWaiting = false;
                });
            }
        }

        return searchData;
    };

    return myFilter;
  }
]
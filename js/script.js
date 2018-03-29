$(function(){ "use strict";

    var $check = $(".js-check");
    if($check.length > 0){

        $check.on("click", function(e){

            e.preventDefault();
            console.log("start!");
            var client = $(".js-client").val();
            var token = $(".js-token").val();

            checkAccount(client,token);
            
        })
    }

    function checkAccount(client,token){
        
        //var media = getMedia(token);
        $.when(getMedia(token)).done(function(media){
            if(media.data.length == 0){
                console.log("Nothing to wotk with");
                return;
            }
            for(var i=0; i<media.data.length; i++){
                if(media.data[i].comments.count > 0) checkComments(media.data[i].id,token);
            }
        });
    }

    function getMedia(token){
        return $.ajax({
        url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + token,
        dataType: 'json',
        type: 'GET',
        success: function( response ) {
          //return response;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR, textStatus, errorThrown );
        }
      });
    }

    function getComments(id,token){
        return $.ajax({
        url: 'https://api.instagram.com/v1/media/' + id + '/comments?access_token=' + token,
        dataType: 'json',
        type: 'GET',
        success: function( response ) {
          //return response;
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR, textStatus, errorThrown );
        }
      });
    }

    function checkComments(id,token){
        
        //var comments = getComments(id,token);
        $.when(getComments(id,token)).done(function(comments){
            for(var i=0; i<comments.data.length; i++){
            console.log(comments.data[i].text);
            }
        });
    }
});
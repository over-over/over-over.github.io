$(function(){ "use strict";

    var $check = $(".js-check");
    var commentsTable = [];

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
            if(comments.data.length == 0){
                console.log("Nothing to wotk with");
                return;
            }

            $.ajax({
                url: '/data/words.json',
                dataType: 'json',
                type: 'GET',
                success: function( response ) {
                    for(var i=0; i<comments.data.length; i++){
                        console.log(comments.data[i].text);
                        var words = comments.data[i].text.split(" ");
                        for(var j=0; j<words.length; j++){
                            if(response.indexOf(words[j]) > -1){
                                addCommentToTable(comments.data[i]);
                            }
                        }
                    }
                    createTable();
                },
                error: function( jqXHR, textStatus, errorThrown ) {
                    console.log( jqXHR, textStatus, errorThrown );
                }
            });

        });
    }

    function addCommentToTable(data){
        var table_row = "<tr>" + 
        "<td>" + data.id + "</td>" +
        "<td>" + data.full_name + "</td>" +
        "<td><a href='" + data.from.profile_picture + "'>Ссылка</a></td>" + 
        "<td>" + data.text + "</td>" +
        "</tr>";
        commentsTable.push(table_row);
    }

    function createTable(){
        if(commentsTable.length > 0){
            $(".js-table").append("<table><tr>" +
            "<th>ID комментария</th>" +
            "<th>Имя комментатора</th>" +
            "<th>Ссылка на комментарий</th>" +
            "<th>Текст комментария</th>" +
            "</tr></table>");
            for(var i=0; i<commentsTable.length; i++){
                $(".js-table table").append(commentsTable[i]);
            }
        }
    }
});
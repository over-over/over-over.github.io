$(function(){ "use strict";

    var $check = $(".js-check");
    var $delete = $(".js-delete");
    var commentsTable = [];
    var commentsData = [];
    var token = "";

    if($check.length > 0){

        $check.on("click", function(e){

            e.preventDefault();
            console.log("start!");
            token = $(".js-token").val();
            commentsTable = [];
            commentsData = [];
            $(".js-table table").remove();
            $delete.hide();
            checkAccount(token);
            
        });

        $delete.on("click", function(){

            for(var i=0; i<commentsData.length; i++){
                deleteComment(commentsData[i].media,commentsData[i].comment,token);
            }
            $(".js-table").append("<p>Всё чисто!</p>");
        });
    }

    function checkAccount(token){
        
        //var media = getMedia(token);
        $.when(getMedia(token)).done(function(media){
            if(media.data.length == 0){
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
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR, textStatus, errorThrown );
        }
      });
    }

    function checkComments(id,token){
        
        $.when(getComments(id,token)).done(function(comments){
            if(comments.data.length == 0){
                return;
            }

            $.ajax({
                url: '/data/words.json',
                dataType: 'json',
                type: 'GET',
                success: function( response ) {
                    for(var i=0; i<comments.data.length; i++){
                        var words = comments.data[i].text.split(" ");
                        for(var j=0; j<words.length; j++){
                            if(response.filter[0].indexOf(words[j]) > -1){
                                addCommentToTable(id,comments.data[i]);
                                updateTable();
                            }
                        }
                    }
                },
                error: function( jqXHR, textStatus, errorThrown ) {
                    console.log( jqXHR, textStatus, errorThrown );
                }
            });

        });
    }

    function addCommentToTable(id,data){
        var table_data = {"media": id, "comment": data.id};
        var table_row = "<tr>" + 
        "<td>" + data.id + "</td>" +
        "<td>" + data.full_name + "</td>" +
        "<td>" + data.username + "</td>" +
        "<td>" + data.text + "</td>" +
        "</tr>";
        commentsTable.push(table_row);
        commentsData.push(table_data);
    }

    function updateTable(){
        if($(".js-table table").length == 0){
            $(".js-table").append("<table><tr>" +
            "<th>ID комментария</th>" +
            "<th>Имя комментатора</th>" +
            "<th>Никнейм комментатора</th>" +
            "<th>Текст комментария</th>" +
            "</tr></table>");
        }
        $(".js-table table").append(commentsTable[commentsTable.length - 1]);
        $delete.show();
    }

    function deleteComment(media,comment,token){
        $.ajax({
        url: 'https://api.instagram.com/v1/media/'+ media +'/comments/'+ comment +'?access_token=' + token,
        dataType: 'json',
        method: 'POST',
    	data: {_method: 'delete' },
        success: function( response ) {
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          console.log( jqXHR, textStatus, errorThrown );
        }
      });
    }
});
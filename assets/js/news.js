var content;
var url = "https://www.googleapis.com/blogger/v3/blogs/7913237957447191767/posts?key=AIzaSyDO0gVmX_e8P578L5BXnMakhHA_2TTOZw4";
$.ajax({
    url: url,
    method: 'GET',
    dataType: 'jsonp'
}).done(function(data) {
    console.log(data);
    //
    for (var i = 0; i < data.items.length; i++) {
        content = $("<div>" + data.items[i].content + "</div>");
        content.find("img").removeAttr('height');
        content.find("img").removeAttr('width');
        content.find("img").addClass('img-responsive');
        content.find("img").addClass('center-block');
        var parent = content.find("img").parent().parent();
        var tempContent = content.find("img").detach();
        parent.append(tempContent);
        //
        var newsCard = $("#template_news_card").clone();
        newsCard.removeAttr("id");
        newsCard.find(".news_content").attr("id", "news_" + i);
        newsCard.find(".news_content").addClass("collapse");
        if (i == 0) {
            newsCard.find(".news_content").addClass("in");
        }
        newsCard.find(".panel-footer").attr("id", "news_" + i + "_toggle");
        newsCard.find(".panel-footer").attr("data-target", "#news_" + i);
        //
        newsCard.find(".news_content").append(content);
        newsCard.find(".news_title").text(data.items[i].title);
        //
        $("#main").append(newsCard);
    }
    //
}).fail(function(jqXHR) {
    console.log("----------------------------------------------------------------------");
    alert("There was an error while trying to get Lane Tech's blog data.");
    console.log(jqXHR);
    console.log("----------------------------------------------------------------------");
});
//
$(window).on('load', function(e) {
    $("#loader_wrapper").fadeOut();
});

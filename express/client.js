
function list_posts(data) {
var titles=JSON.parse(data);
var buf="<ul>";
titles.forEach(element => {
    buf+='<li><a href="javascript:load_post('+"'"+element.slug+"')"+'">'+element.title+'</a></li>';
});

return buf+"</ul>"
}

function load_post(slug) {
    localStorage.setItem("current_page",slug);
    $.get("post/"+slug, function(data, status){
        var post_data=JSON.parse(data);
        var converter = new showdown.Converter();
        var html =converter.makeHtml(post_data.post.content);
        html+='<br><br><a href="javascript:back()">Back to the listing of posts</a>';
        $("#content").html(html)
    });
}

function back() {
    localStorage.removeItem("current_page");
    window.location="/";
}

function main_page() {
    var current=localStorage.getItem("current_page");
    if (current) {
        load_post(current)
        return 0;
    }
    var page="<h3>The list of posts</h3><br>";
    page+="<h1>Posts</h1><br>"
    
    $.get("posts", function(data, status){
        page+=list_posts(data);
        $("#content").html(page)
    });
}

main_page()
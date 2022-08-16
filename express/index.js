const express = require('express')
const fs = require('fs')
const { getTopWords } = require('./utils/tags')
const app = express()
const rootPostDir = 'assets/posts'
const documentRoot='express'

function json_post(slug) {
  var post={}
  var file = rootPostDir + '/' + slug + ".md"
  var buf=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
  var buf= buf.split("===")
  var post_content = buf[2]
  
  /* No time to figure out how to use it */

  //var words=getTopWords(post_content,5);     
  ///console.log(words)
  
  var ret={ 
    post: {content: post_content,tags: null }
  }
  return JSON.stringify(ret)
}
/**
 *  Returns the detail of an individual post in json, formatted as:
 * {
 *  post: {
 *    content: <article's markdown content>,
 *    tags: <array of 5 top tags for the post>
 *  }
 * }
 */
app.get('/post/:slug', function (req, res) {
  var slug=req.params.slug
  res.send(json_post(slug))     
  res.end();
})

/**
 * Returns a json array of all posts, formatted as:
 * [
 *  {
 *    title: <article's title>,
 *    slug: <article's slug>
 *  },
 *  ...
 * ]
 */

 function get_post(buf) {
  var post={}
  var buf= buf.split("===")
  buf=buf[1].trim()
  buf=buf.split("\n")
  

  post.title=buf[0].substr(7)
  //post.author=buf[1].substr(8)
  post.slug=buf[2].substr(6)

  return post
}


app.get('/posts', function (req, res) {
  fs.readdir(rootPostDir, function (err, items) {
    var posts=[]
    for (var i=0; i<items.length; i++) {
      var file = rootPostDir + '/' + items[i]
      var data=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
      posts.push(get_post(data))
    }
    res.send(JSON.stringify(posts))
    res.end();
  })
})

app.get('/:fname', function (req, res) {
  var file_name=req.params.fname
  var file = documentRoot + '/' + file_name  
  try {
    var buf=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
  } catch (err) {
  res.send("Not Found")
  res.end()
  return 0
  }
  res.send(buf)
  res.end()
})

app.get('/', function (req, res) {
  var file = documentRoot + '/index.html'  
  
    var buf=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
  
  res.send(buf)
  res.end()
})
app.listen(3000, function () {
  console.log('Dev app listening on port 3000!')
})

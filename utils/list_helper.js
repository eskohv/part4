/* eslint-disable no-unused-vars */

const dummy = (blogs) => {
    return blogs.length === 0
        ? 1
        : blogs.length
}

const totalLikes = (blogs) => {
    if(!blogs) return 0
    const reducer = (sum, item) => {
        return sum + item
    }
    const likes = blogs.map(blog => blog.likes)
    return likes.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    if(!blogs) return null
    let favouriteBlog = null
    let mostLikes = -1

    blogs.forEach(blog => {
        let likes = blog.likes
        if (likes > mostLikes) {
            mostLikes = likes

            favouriteBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })
    return favouriteBlog
}

const mostBlogs = (blogs) => {
    let authorsWithDupes = []
    blogs.forEach((item) => {
        let temp = {
            author: item.author,
            blogs: 0
        }
        authorsWithDupes.push(temp)
    })

    let authors = []
    authorsWithDupes.forEach(item => {
        if(authors.map(item => item.author).indexOf(item.author) < 0) {
            authors.push(item)
        }
    })


    blogs.forEach(blog => {
        authors.forEach(author => {
            if(author.author === blog.author){
                author.blogs += 1
            }
        })
    })

    let topBlogger = null
    let mostBlogs = -1
    authors.forEach(author => {
        if(author.blogs > mostBlogs){
            topBlogger = author
            mostBlogs = author.blogs
        }
    })

    return topBlogger
}

const mostLikes = (blogs) => {
    let authorsWithDupes = []
    blogs.forEach((item) => {
        let temp = {
            author: item.author,
            likes: 0
        }
        authorsWithDupes.push(temp)
    })

    let authors = []
    authorsWithDupes.forEach(item => {
        if(authors.map(item => item.author).indexOf(item.author) < 0) {
            authors.push(item)
        }
    })

    blogs.forEach(blog => {
        authors.forEach(author => {
            if(author.author === blog.author){
                author.likes += blog.likes
            }
        })
    })

    let topBlogger = null
    let mostLikes = -1
    authors.forEach(author => {
        if(author.likes > mostLikes){
            topBlogger = author
            mostLikes = author.likes
        }
    })

    return topBlogger
}
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
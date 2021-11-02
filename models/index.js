const User = require('./User')
const Post = require('./Post')
const Location = require('./Location')
const Bird = require('./Bird')
const SeenBird = require('./SeenBird')
const Comment = require('./Comment')
const Like = require('./Like')

// User
User.hasMany(Post,{
    onDelete: 'CASCADE'
})
User.hasOne(Bird)

// Post
Post.belongsTo(User)
Post.hasMany(Comment)
Post.belongsToMany(Bird, {
    through: SeenBird
})
Post.hasOne(Location)
Post.hasMany(Like, {
    onDelete: 'CASCADE'
})

// SeenBird
SeenBird.belongsTo(Post)
SeenBird.belongsTo(Bird)

// Bird
Bird.belongsTo(User)
Bird.belongsToMany(Post, {
    through: SeenBird
})

// Comment
Comment.belongsTo(Post)

// Like
Like.belongsTo(Post)

// Location
Location.belongsTo(Post)

module.exports = { User, Post, Location, Bird, Comment, SeenBird }

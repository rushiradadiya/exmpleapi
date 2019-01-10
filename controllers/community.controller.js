const Community = require('../schemas/community.schema')
const Media = require('../schemas/media.schema')
const {db} = require('../configs/database')

Community.hasMany(Media, {foreignKey: 'community_id'})
Media.belongsTo(Community, {foreignKey: 'community_id'})

exports.insert = (body, images, done) => {
    var communityData = {
        title: body.title,
        description: body.description ? body.description : null
    }

    Community.create(communityData)
    .then((newRecord) => {
        if(newRecord){
            if(images.length > 0){
                for(i=0;i<images.length;i++){
                    var mediaData = {
                        type: 'Community',
                        community_id: newRecord.id,
                        image_url: images[i].filename
                    }

                    Media.create(mediaData)
                    .then((newMedia) =>{
                        console.log(newMedia)
                    }).catch((err) => {
                        done(err)
                    })
                }
                done(null, "Record inserted successfully")
            }else {
                done(null, "Record inserted successfully")
            }
        }else {
            done("Problem inserting data")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.update = (id, body, images, done) => {
    var communityData = {
        title: body.title,
        description: body.description ? body.description : null
    }

    Community.update(communityData, {
        where:{
            id: id
        }
    })
        .then((updatedData) => {
            if(updatedData){
                if(images.length > 0){
                    for(i=0;i<images.length;i++){
                        var mediaData = {
                            type: 'Community',
                            community_id: id,
                            image_url: images[i].filename
                        }

                        Media.create(mediaData)
                            .then((newMedia) =>{
                                console.log(newMedia)
                            }).catch((err) => {
                            done(err)
                        })
                    }
                    done(null, "Record updated successfully")
                }else {
                    done(null, "Record updated successfully")
                }
            }else {
                done("Problem updating data")
            }
        }).catch((err) => {
        done(err)
    })
}

exports.getAll = (done) => {
    Community.findAll({
        include: [{model: Media, attributes: ['id','image_url']}],
        attributes: ['id', 'title', 'description', 'createdAt']
    }).then((data) => {
        done(null, data)
    }).catch((err) => {
        done(err)
    })
}

exports.deleteMedia = (ids, done) => {
    db.query('DELETE FROM `Media` WHERE id in ('+ ids +')')
    .spread((deleted) => {
        if(deleted){
            done(null, "Media deleted")
        }else {
            done("Problem deleting media")
        }
    }).catch((err) => {
        done(err)
    })
}

exports.deleteCommunity = (id, done) => {
    Media.destroy({
        where:{
            community_id: id
        }
    }).then((mediaDeleted) => {
        Community.destroy({
            where: {
                id: id
            }
        }).then((communityDeleted) => {
            if(communityDeleted){
                done(null, "Community deleted")
            }else {
                done("Problem deleting community")
            }
        }).catch((err) => {
            done(err)
        })
    }).catch((err) => {
        done(err)
    })
}

//DELETE FROM `Media` WHERE id in (1,2)
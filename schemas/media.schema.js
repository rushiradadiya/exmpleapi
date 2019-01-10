const Sequelize = require('sequelize');
const {db} = require('./../configs/database.js');
const Community = require('./community.schema')
const StudyMaterial = require('./studyMaterial.schema')

const mediaSchema =db.define('Media',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    type:{
        type: Sequelize.ENUM('Community', 'StudyMaterial'),
    },
    community_id: {
        type: Sequelize.INTEGER,
    },
    studyMaterial_id: {
        type: Sequelize.INTEGER,
    },
    image_url: {
        type: Sequelize.STRING
    }
});

mediaSchema.belongsTo(Community, {foreignKey: 'community_id'})
mediaSchema.belongsTo(StudyMaterial, {foreignKey: 'studyMaterial_id'})

mediaSchema.sync({force:false}).then((res)=>{
    console.log("Media table created");
}).catch((err)=>{
    console.log(err);
});

module.exports = mediaSchema;
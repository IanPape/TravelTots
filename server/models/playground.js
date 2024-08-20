module.exports = (sequelize, DataTypes) => {
    const Playground = sequelize.define('Playground', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      map_link: {  // Changed to match your database column name
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'playgrounds',
      underscored: true,
      timestamps: false, 
    });
  
    Playground.associate = function(models) {
      Playground.belongsToMany(models.Folder, {
        through: models.FolderPlaygrounds,
        foreignKey: 'playground_id',
        as: 'folders'  // Changed alias to 'folders'
      });
    };
  
    return Playground;
  };
  
module.exports = (sequelize, DataTypes) => {
    const Folder = sequelize.define('Folder', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'folders',
      underscored: true,
      timestamps: false, 
    });
  
    Folder.associate = function(models) {
      Folder.belongsTo(models.User, { foreignKey: 'user_id' });
      Folder.belongsToMany(models.Playground, {
        through: models.FolderPlaygrounds,
        foreignKey: 'folder_id',
        as: 'playgrounds'  // Changed alias to 'playgrounds'
      });
    };
  
    return Folder;
  };
  
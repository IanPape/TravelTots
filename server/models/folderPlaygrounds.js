module.exports = (sequelize, DataTypes) => {
    const FolderPlaygrounds = sequelize.define('FolderPlaygrounds', {
      folder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Folder',
          key: 'id'
        }
      },
      playground_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Playground', 
          key: 'id'
        }
      }
    }, {
      tableName: 'folder_playgrounds', // Specify the correct table name here
      underscored: true, 
      timestamps: false, 
                    // Optional: if you are using snake_case columns
    });
  
    return FolderPlaygrounds;
  };
  
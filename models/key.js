module.exports = function (sequelize, DataTypes) {
    var Key = sequelize.define('Key', {
      service: DataTypes.STRING,
      key: DataTypes.STRING
    }, {
      // classMethods
    });

    return Key;
};

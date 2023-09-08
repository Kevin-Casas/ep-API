'use strict';
module.exports = (sequelize, DataTypes) => {
  const edificio = sequelize.define('edificio', {
    nombre: DataTypes.STRING,
    direccion: DataTypes.STRING,
    tipo: DataTypes.STRING
  }, {});
  edificio.associate = function(models) {
    // associations can be defined here
  };
  return edificio;
};
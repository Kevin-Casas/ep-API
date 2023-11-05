'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    numLegajo: {
      type: DataTypes.INTEGER,
      allowNull:false,
    }
  }, {
    tableName: "usuarios"
  });
  usuario.associate = function(models) {
    // associations can be defined here
  };
  return usuario;
};
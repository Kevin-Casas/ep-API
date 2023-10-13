'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        isAlpha: {
          msg: "El nombre solo debe contener letras"
        }
      }
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: {
          args: [6, 255],
          msg:"La contraseña debe contener al menos 6 caracteres"
        }
      }
    },
    numLegajo: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        len: {
          args: [8],
          msg:"El legajo debe contener 8 digitos"
        }
      }
    }
  }, {
    tableName: "usuarios"
  });
  usuario.associate = function(models) {
    // associations can be defined here
  };
  return usuario;
};
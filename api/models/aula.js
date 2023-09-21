'use strict';
module.exports = (sequelize, DataTypes) => {
  const aula = sequelize.define('aula', {
    nombre: DataTypes.STRING,
    tipo: DataTypes.STRING,
    id_edificio: DataTypes.INTEGER
  }, {});
  aula.associate = function(models) {
    // associations can be defined here
    aula.belongsTo(models.edificio, 
      {
        as: "Edificio-Relacionado",
        foreignKey: "id_edificio"
    })
  };
  return aula;
};
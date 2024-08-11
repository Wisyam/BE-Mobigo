'use strict';
let md5 = require('md5')
const now = new Date()
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'user1',
        password: md5('password1'),
        email: 'test@gmail.com',
        role: 'admin',
        number: '123456789',
        createdAt: now,
        updatedAt: now,
      },
      {
        username: 'user2',
        password: md5('password2'),
        email:'email2@gmail.com',
        role: 'user',
        number: '987654321',
        createdAt: now,
        updatedAt: now,
      },
      // tambahkan data pengguna lainnya di sini
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

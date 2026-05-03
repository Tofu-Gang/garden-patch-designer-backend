'use strict';

/**
 * patch controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::patch.patch');

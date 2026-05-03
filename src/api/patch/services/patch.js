'use strict';

/**
 * patch service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::patch.patch');

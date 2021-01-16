'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */
//const elements = require ( '../../scripts/elements' );

const findPublicRole = async () => {
    const result = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "authenticated" });
    return result;
  };
  
  const setDefaultPermissions = async (ctx) => {
    const role = await findPublicRole();
    const permissions = await strapi
      .query("permission", "users-permissions")
      .find({ type: ctx, role: role.id });
    await Promise.all(
      permissions.map(p =>
        strapi
          .query("permission", "users-permissions")
          .update({ id: p.id }, { enabled: true })
      )
    );
  };


const {
  components,
  elements,
  settings,
  articles
} = require("../../data/data");

const createSeedData = async () => {
  console.log ( 'Import data ...')
  const componentsPromises = components.map(({
    ...rest
  }) => {
    return strapi.services.components.create({
      ...rest
    });
  });

  const articlesPromises = articles.map(({
    ...rest
  }) => {
    return strapi.services.articles.create({
      ...rest
    });
  });

  await Promise.all(componentsPromises);
  
  console.log ( 'Blocks imported.')
  
  await Promise.all(articlesPromises);

  console.log ( 'Articles imported')

  const elementsPromises = await strapi.query('elements').create( elements );
  console.log ( 'Elements imported.')
  const settingsPromises = await strapi.query('settings').create( settings );
  console.log ( 'Settings imported')
}

module.exports = async () => {
    if (process.env.NODE_ENV === 'development') {
      const params = {
        username: process.env.DEV_USER || 'admin',
        password: process.env.DEV_PASS || 'password',
        firstname: process.env.DEV_USER || 'Admin',
        lastname: process.env.DEV_USER || 'Admin',
        email: process.env.DEV_EMAIL || 'admin@test.test',
        blocked: false,
        isActive: true,
      };
      //Check if any account exists.
      const admins = await strapi.query('user', 'admin').find();
  
      if (admins.length === 0) {
       try {
          let tempPass = params.password;
          let verifyRole = await strapi.query('role', 'admin').findOne({ code: 'strapi-super-admin' });
          if (!verifyRole) {
          verifyRole = await strapi.query('role', 'admin').create({
            name: 'Super Admin',
            code: 'strapi-super-admin',
            description: 'Super Admins can access and manage all features and settings.',
           });
          }
          params.roles = [verifyRole.id];
          params.password = await strapi.admin.services.auth.hashPassword(params.password);
          await strapi.query('user', 'admin').create({
            ...params,
          });
          strapi.log.info('Admin account was successfully created.');
          strapi.log.info(`Email: ${params.email}`);
          strapi.log.info(`Password: ${tempPass}`);
        } catch (error) {
          strapi.log.error(`Couldn't create Admin account during bootstrap: `, error);
        }
      }
      await setDefaultPermissions('application');
      await setDefaultPermissions('upload');
      await setDefaultPermissions('email');
      const qryComponents = await strapi.query('components').find()
      if ( qryComponents.length === 0 ){
        await createSeedData();
      }
    }
  };
  

module.exports = ({ env }) => ({
    // ...
    /*
    upload: {
      provider: env('CLOUDINARY_ENABLED')? "cloudinary" : "",
      providerOptions: {
        cloud_name: env('CLOUDINARY_ENABLED') ? env('CLOUDINARY_CLOUD_NAME') : '',
        api_key: env('CLOUDINARY_ENABLED') ? env('CLOUDINARY_API_KEY') : '',
        api_secret: env('CLOUDINARY_ENABLED') ? env('CLOUDINARY_API_SECRET') : ''
      }
    },
    
    email: {
      provider: env('MAILGUN_ENABLED') ? 'mailgun' : '',
      providerOptions: {
        apiKey: env('MAILGUN_ENABLED') ? env('MAILGUN_API_KEY') : '',
        domain: env('MAILGUN_ENABLED') ? env('MAILGUN_DOMAIN') : ''
      },
      settings: {
        defaultFrom: env('MAILGUN_ENABLED') ? env('MAILGUN_FROM') : '',
        defaultReplyTo: env('MAILGUN_ENABLED') ? env('MAILGUN_REPLYTO') : ''
      },
    },
    */
    graphql: {
      endpoint: '/graphql',
      tracing: false,
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 7,
      amountLimit: 100,
    },
    // ...
  });
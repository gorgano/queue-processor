// Use something like dotenv for local dev
// Preferably, Parameter store or similar
// However for typing, any values should be read into a common
// area.  This allows for defining all the values so one is never missed.
//
// NOTE: Obviously this should never be stored in source control.
//      Putting here for ease of use for the example.
export const definedEnv = {
    sendGridKey: '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',
    mailGunKey: 'YXBpOjc2ZDU2YjdiZDJmYzU2MmFiODc1N2QwZjE2YmRmZjc1LTMyNGUwYmIyLWZlODQ0ZjYx',
    // Define the primary send method here.
    //   If this was something that watned to be changed dynamically,
    //   storage in a database would be preferable to avoid re-deployment.
    primarySend: 'sendgrid', // mailgun | sendgrid
};

const AWS = require("aws-sdk");
AWS.config.update({
  region: `${process.env.AWS_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
  },
});

const dispatchEmail = async (bodyContent) => {
  const params = {
    Destination: {
      ToAddresses: ["mohammedroshidhdeveloper@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${bodyContent}</h1>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Support from Matchalorie",
      },
    },
    Source: "support@matchalorie.life",
  };

  const sendEmailCommand = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
};

module.exports = { dispatchEmail };

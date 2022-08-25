export default ({ env }) => ({
  upload: {
    config: {
      provider: "custom-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
        region: env("S3_REGION"),
        bucket: env("S3_BUCKET_NAME"),
        S3_BUCKET_URL: env("S3_BUCKET_URL"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

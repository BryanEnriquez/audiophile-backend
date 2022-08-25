// Adapted from: https://www.npmjs.com/package/@strapi/provider-upload-aws-s3
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const getKey = (file) => {
  const path = file.path ? `${file.path}/` : "";
  return `${path}${file.hash}${file.ext}`;
};

module.exports = {
  init: ({ region, bucket, accessKeyId, secretAccessKey, S3_BUCKET_URL }) => {
    // Initialize client
    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const upload = async (file, customParams = {}) => {
      const key = getKey(file);

      const command = new PutObjectCommand({
        Bucket: bucket,
        Body: file.stream || Buffer.from(file.buffer, "binary"),
        ContentType: file.mime,
        Key: key,
        ...customParams,
      });

      try {
        await client.send(command);

        // Generate full url using BUCKET URL + file name (key)
        file.url = `${S3_BUCKET_URL}${key}`;
      } catch (err) {
        throw err;
      }
    };

    return {
      uploadStream(file, customParams = {}) {
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        return upload(file, customParams);
      },
      delete: async (file, customParams = {}) => {
        // Deletes file with specified key from the specified bucket
        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: getKey(file),
          ...customParams,
        });

        try {
          await client.send(command);
        } catch (err) {
          throw err;
        }
      },
    };
  },
};

import AWS from 'aws-sdk';


export const s3bucket = new AWS.S3({
    accessKeyId: 'AKIAIQOXBUJATWBTM5EQ',
    secretAccessKey: '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',
    Bucket: 'slashit',
    region: 'eu-west-1',
    endpoint: 's3.eu-west-1.amazonaws.com'
});

# Open points

* S3 events create bucket themselves, so I cannot use CloudFormation to auto-deploy event trigger for any created file. I see someone is using serverless plugins like s3-external-events or something similar.

* I miss creating scripts for resource creation (S3 bucket, DynamoDB table)
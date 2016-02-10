#!/usr/bin/env bash

echo "S3 BUCKET: "${npm_package_config_s3_bucket:?"The S3 bucket needs to be set in the package.json"}
echo "PROJECT SLUG: "${npm_package_config_slug:?"The project's slug needs to be set in the package.json"}
echo

export APP_S3_BUCKET=$npm_package_config_s3_bucket
export PROJECT_SLUG=$npm_package_config_slug

echo "Syncing *.css files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.css' --cache-control 'max-age=31536000' --content-encoding 'gzip' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing *.js files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.js' --cache-control 'max-age=31536000' --content-encoding 'gzip' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing *.html files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.html' --content-encoding 'gzip' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing image files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.jpg' --include '*.png' --include '*.gif' --cache-control 'max-age=604800' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing *.svg files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.svg' --content-encoding 'gzip' --cache-control 'max-age=604800' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing *.json files to S3..."
aws s3 sync --acl public-read --profile newsapps --exclude '*.*' --include '*.json' --cache-control 'max-age=3600' --content-encoding 'gzip' dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

echo "Syncing everything else to S3..."
aws s3 sync --profile newsapps dist s3://$APP_S3_BUCKET/$PROJECT_SLUG/

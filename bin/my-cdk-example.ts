#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { MyCdkExamplePipelineStack } from '../lib/my-cdk-example-pipeline.stack';

const app = new cdk.App();

new MyCdkExamplePipelineStack(app, 'MyCdkExamplePipelineStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
  });
  
  app.synth();
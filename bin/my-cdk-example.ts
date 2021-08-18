#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { MyCdkExampleStack } from '../lib/my-cdk-example-stack';

const app = new cdk.App();
new MyCdkExampleStack(app, 'MyCdkExampleStack');

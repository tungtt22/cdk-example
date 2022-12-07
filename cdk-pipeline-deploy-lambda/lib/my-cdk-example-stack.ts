import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import path = require('path');

export class MyCdkExampleStack extends Stack {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaHandler = new lambda.Function(this, 'MyCdkExampleLambda', {
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../slack-lambda-functions')),
    });

    const apiGw = new apigw.LambdaRestApi(this, 'MyCdkExampleApiGateway', {
      description: 'Endpoint for a trigger Slack Lambda Function',
      handler: lambdaHandler,
    });

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: apiGw.url,
    });
  }
}

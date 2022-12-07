import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";
import { MyCdkExampleStage } from './my-cdk-example-stage';

export class MyCdkExamplePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('tungtt22/my-cdk-example', 'master', {
          authentication: SecretValue.secretsManager('github-tungtt'),
        }),

        commands: [
          'ls',
          'pwd',
          'npm install',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new MyCdkExampleStage(this, 'dev', {
      env: {
        account: 'ACCOUNT ID',
        region: 'us-east-2'
      }
    }));
  }
}

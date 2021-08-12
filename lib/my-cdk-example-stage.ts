import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { MyCdkExampleStack } from './my-cdk-example-stack';

export class MyCdkExampleStage extends Stage {
  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new MyCdkExampleStack(this, 'MyCdkExampleStack');
    
    this.urlOutput = service.urlOutput;
  }
}

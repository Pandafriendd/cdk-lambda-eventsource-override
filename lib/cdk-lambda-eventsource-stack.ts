import * as cdk from '@aws-cdk/core';

import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class CdkLambdaEventsourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const handler = new lambda.Function(this, 'MyFunc', {
      code: lambda.Code.fromInline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS,
    });
    
    const q = new sqs.Queue(this, 'SQSQ');

    handler.addEventSource(new SqsEventSource(q));
    
    //console.log(handler.node.children.toString());
    //console.log(handler.node.uniqueId);
    //console.log(handler.node.id);
    //console.log(handler.node.tryFindChild("CdkLambdaEventsourceStackMyFunc5FAC2F8D"))
    
    //const lambdas = appStack.children.filter((child) => child instanceof Function)
     
    var i = 1;
    handler.node.children.forEach(child => {
        console.log(child.node.id);
        /*
        if (
          (child.node.defaultChild as lambda.CfnEventSourceMapping).cfnResourceType === 'AWS::Lambda::EventSourceMapping'
          ) {
            (child.node.defaultChild as lambda.CfnEventSourceMapping).addOverride('Properties.MaximumBatchingWindowInSeconds', '10');
          }
          */
        
        // overriding low level construct, when we found a child of the lambda function is EventSourceMapping type
        if (child instanceof lambda.EventSourceMapping) {
          console.log("!");
          const cfnEventSourceMapping = child.node.defaultChild as lambda.CfnEventSourceMapping;
          cfnEventSourceMapping.addOverride('Properties.MaximumBatchingWindowInSeconds', '10');
        }
        
        
        console.log(i++);
      });
    
    handler.addEventSourceMapping("mapping", {
      eventSourceArn: q.queueArn,
      maxBatchingWindow: cdk.Duration.seconds(10),
    })
  }
}

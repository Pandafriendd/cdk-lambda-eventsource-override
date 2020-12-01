#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkLambdaEventsourceStack } from '../lib/cdk-lambda-eventsource-stack';

const app = new cdk.App();
new CdkLambdaEventsourceStack(app, 'CdkLambdaEventsourceStack');

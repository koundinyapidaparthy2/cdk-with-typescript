import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { GrantPermissionMethods } from "./stacks/grant-permissions-stack";
import { analyticsStack } from "./stacks/grantpermissionStack";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkwithtypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new GrantPermissionMethods(scope, "grant-permissions", props);
    new analyticsStack(scope, "analyticsStack", props);
  }
}
